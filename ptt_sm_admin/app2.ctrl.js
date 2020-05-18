angular.module("app").controller("AboutCategoryCtrl", ['$scope'
	, '$http'
	, '$window'
	, 'toastr'
	, 'authService'
	, '$timeout'
	, '$state'
	, 'categoryService'
	, 'aboutService'
	, 'Upload'
	, 'appSetting'
	, '$uibModal', AboutCategoryCtrl]);
function AboutCategoryCtrl($scope
	, $http
	, $window
	, toastr
	, authService
	, $timeout
	, $state
	, categoryService
	, aboutService
	, Upload
	, appSetting
	, $uibModal) {

	var ctrl = this;
	ctrl.state = 'add';
	ctrl.title = 'Add Category';
	ctrl.categoryType = '';
	ctrl.categories = [];
	ctrl.status = ['Active', 'Inactive'];

	ctrl.editObj = null;
	ctrl.resetEditObj = function () {
		ctrl.editObj = {
			id: 0,
			name: null,
			status: 'Inactive',
			icon: null,
			deleteIconImage: false,
			iconImagePath: null,
			file: null
		};
	}

	ctrl.canViewAbout = authService.isGranted('view_about');
	ctrl.canEditAbout = authService.isGranted('modify_about');
	//console.log(ctrl.canViewAbout, ctrl.canEditAbout);

	categoryService.getCategoryTypes().then(function (r) {
		angular.forEach(r, function (v, k) {
			if (v.name == 'About-SM') {
				ctrl.categoryType = v;
			}
		})
	})
	ctrl.loadCategories = function () {
		categoryService.getAboutCategories().then(function (r) {
			ctrl.categories = r;
			if (ctrl.editObj.id != 0) {
				angular.forEach(ctrl.categories, function (v, k) {
					if (v.id == ctrl.editObj.id) {
						ctrl.editCategory(v)
					}
				});
			}
		})
	}
	ctrl.loadAddedCategories = function () {
		categoryService.getAboutCategories().then(function (r) {
			ctrl.categories = r;
			if (ctrl.editObj.id === 0) {
				angular.forEach(ctrl.categories, function (v, k) {
					if (v.priority == 1) {
						let obj = {
							active: true,
							categoryID: v.id,
							title: v.name,
							content: null
						}
						aboutService.updateAboutContent(obj).then(function (r) {

						}, function (err) {
							toastr.error(err.statusText, 'Error');
						});
					}
				});
			}
		})
	}
	ctrl.isAllSelected = false;
	ctrl.toggleAll = function () {
		var toggleStatus = !ctrl.isAllSelected;
		if (toggleStatus) {
			ctrl.showDelete = true;
		} else {
			ctrl.showDelete = false;
		}
		angular.forEach(ctrl.categories, function (itm) {
			itm.selected = toggleStatus;
		});
	}
	ctrl.optionToggled = function () {
		ctrl.isAllSelected = ctrl.categories.every(function (itm) {
			return itm.selected;
		})
		let sel = false;
		angular.forEach(ctrl.categories, function (value, key) {
			if (value.selected) {
				sel = true;
			}
		});
		if (sel)
			ctrl.showDelete = true;
		else
			ctrl.showDelete = false;
	}
	ctrl.updateCategoryStatus = function (r) {
		categoryService.updateCategoryStatus(r.id, r.status).then(function (r) {
			toastr.success("บันทึกสำเร็จ");
			ctrl.loadCategories();
		}, function (err) {
			toastr.error(err.statusText, 'Error');
		})
	}
	ctrl.editCategory = function (s) {
		ctrl.state = 'edit';
		ctrl.title = 'Edit Category';
		ctrl.editObj = angular.copy(s);
	}
	// upload image icon
	ctrl.file = null;
	ctrl.setImage = function (file) {
		if (ctrl.editObj === null)
			ctrl.editObj = {};

		ctrl.editObj.file = file;
	}
	ctrl.removeImage = function () {
		ctrl.editObj.file = null;
		ctrl.file = null;
		if (ctrl.editObj.iconImagePath != null) {
			ctrl.editObj.deleteIconImage = true;
			ctrl.editObj.iconImagePath = null;
		}
	}
	ctrl.cancelCategory = function () {
		ctrl.state = 'add';
		ctrl.title = 'Add Category';
		ctrl.editObj = {
			id: 0,
			name: null,
			status: 'Inactive',
			icon: null,
			iconImagePath: null,
			deleteIconImage: false,
			file: null
		};
		ctrl.file = null;
	}
	ctrl.processing = false;
	ctrl.saveCategory = function (valid) {
		angular.forEach($scope.frmCategory.$$controls, function (field) {
			field.$setDirty();
			field.$validate();
		});
		if (valid) {
			if (ctrl.state == 'add') {
				ctrl.editObj.id = 0;
				ctrl.editObj.displayLayout = null;
			}

			var fd = new FormData();
			fd.append('ID', ctrl.editObj.id);
			fd.append('Status', ctrl.editObj.status);
			fd.append('Name', ctrl.editObj.name);
			fd.append('CategoryTypeID', ctrl.categoryType.id);
			fd.append('Icon', ctrl.editObj.icon);
			fd.append('DeleteIconImage', ctrl.editObj.deleteIconImage);
			fd.append('IconImagePath', ctrl.editObj.iconImagePath);
			fd.append('DisplayLayout', ctrl.editObj.displayLayout);

			if (ctrl.file != null) {
				fd.append('file', ctrl.file);
			} else {
				fd.append('file', null);
			}

			/*for (var pair of fd.entries()) {
				console.log(pair[0]+ ', ' + pair[1]); 
			}*/
			//reset file & state
			ctrl.processing = true;
			$http.post(appSetting.apiBaseUrl + '/api/category/saveCategory', fd, {
				transformRequest: angular.identity,
				headers: {
					'Content-Type': undefined
				}
			}).then(function (r) {
				toastr.success("บันทึกสำเร็จ");
				ctrl.processing = false;
				ctrl.file = null;
				if (ctrl.state == 'add') {
					ctrl.file = null;
					ctrl.resetEditObj();
				}
				$scope.frmCategory.$setPristine();
				$scope.frmCategory.$setUntouched();
				if (ctrl.editObj.id == 0) {
					ctrl.loadAddedCategories();
				} else {
					ctrl.loadCategories();
				}
			}, function (err) {
				ctrl.processing = false;
				toastr.error(err.statusText, 'Error');
			});
		}
	}
	ctrl.deleteCategory = function () {

		var found = false;
		angular.forEach(ctrl.categories, function (v, k) {
			if (v.selected) {
				found = true;
			}
		});
		if (!found) {
			toastr.warning('กรุณาเลือกรายการที่ต้องการ', 'Error');
			return;
		}

		var modalInstanceCtrl = ['$scope', '$uibModalInstance', function ($scope, $uibModalInstance) {

			$scope.submit = function () {
				$uibModalInstance.close(true);
			}
			$scope.close = function () {
				$uibModalInstance.close(false);
			}
		}];

		var modalInstance = $uibModal.open({
			animation: true,
			templateUrl: 'confirm-delete.html',
			controller: modalInstanceCtrl,
			backdrop: 'static',
			size: ''
		});

		modalInstance.result.then(function (confirm) {
			if (confirm) {
				var delObjs = [];
				var categoryIDs = [];
				angular.forEach(ctrl.categories, function (v, k) {
					if (v.selected) {
						delObjs.push({
							id: v.id,
							categoryTypeID: ctrl.categoryType.id
						});
						categoryIDs.push(v.id)
					}
				});
				if (delObjs.length > 0) {
					// delete about content before
					aboutService.deleteAboutContents(categoryIDs).then(function () {
						categoryService.deleteCategory(delObjs).then(function (r) {
							toastr.success("ลบรายการสำเร็จ");
							ctrl.loadCategories();
						}, function (err) {
							toastr.error(err.statusText + ':' + err.data, 'Error');
						})
					})
				}
				else {
					toastr.warning('กรุณาเลือกรายการที่ต้องการ', 'Error');
				}
			}
		});
	}
	ctrl.updateCategoryPriority = function (s) {

		categoryService.updateCategoryPriority(s.id, s.priority).then(function (r) {
			toastr.success("บันทึกสำเร็จ");
			ctrl.loadCategories();
		}, function (err) {
			toastr.error(err.statusText + ':' + err.data, 'Error');
		});
	}

	ctrl.preview = function (item) {
		var url = $state.href('preview', { p: item.id, m: 'about' });
		$window.open(url, '_blank');
	}
	ctrl.goto = function (sel) {
		if (sel === 'Dashboard') {
			$state.go('portal.dashboard');
		}
	}
	ctrl.editContent = function (o) {
		$state.go('portal.aboutcontent', { obj: o });
	}

	// load data 
	ctrl.resetEditObj();
	ctrl.loadCategories();
}

angular.module("app").controller("ApplicationCategoryCtrl", ['$scope'
	, '$http'
	, '$window'
	, 'toastr'
	, 'authService'
	, '$timeout'
	, '$state'
	, 'categoryService'
	, 'Upload'
	, 'appSetting'
	, '$uibModal', ApplicationCategoryCtrl]);
function ApplicationCategoryCtrl($scope
	, $http
	, $window
	, toastr
	, authService
	, $timeout
	, $state
	, categoryService
	, Upload
	, appSetting
	, $uibModal) {

	var ctrl = this;
	ctrl.state = 'add';
	ctrl.title = 'Add Category';
	ctrl.categoryType = '';
	ctrl.categories = [];
	ctrl.status = ['Active', 'Inactive'];

	ctrl.editObj = null;
	ctrl.resetEditObj = function () {
		ctrl.editObj = {
			id: 0,
			name: null,
			status: 'Inactive',
			icon: null,
			deleteIconImage: false,
			iconImagePath: null,
			color: '#fcb712',
			file: null
		};
	}

	ctrl.canEditCategoryApplications = false;
	ctrl.canViewCategoryApplications = false;
	ctrl.canViewCategoryApplications = authService.isGranted('view_category_applications');
	ctrl.canEditCategoryApplications = authService.isGranted('modify_category_applications');

	categoryService.getCategoryTypes().then(function (r) {
		angular.forEach(r, function (v, k) {
			if (v.name == 'Applications') {
				ctrl.categoryType = v;
			}
		})
	})
	ctrl.loadCategories = function () {
		categoryService.getApplicationCategories().then(function (r) {
			ctrl.categories = r;
		})
	}

	ctrl.toggleAll = function () {
		var toggleStatus = !ctrl.isAllSelected;
		if (toggleStatus) {
			ctrl.showDelete = true;
		} else {
			ctrl.showDelete = false;
		}
		angular.forEach(ctrl.categories, function (itm) {
			itm.selected = toggleStatus;
		});
	}
	ctrl.optionToggled = function () {
		ctrl.isAllSelected = ctrl.categories.every(function (itm) {
			return itm.selected;
		})
		let sel = false;
		angular.forEach(ctrl.categories, function (value, key) {
			if (value.selected) {
				sel = true;
			}
		});
		if (sel)
			ctrl.showDelete = true;
		else
			ctrl.showDelete = false;
	}
	ctrl.updateCategoryStatus = function (r) {
		categoryService.updateCategoryStatus(r.id, r.status).then(function (r) {
			toastr.success("บันทึกสำเร็จ");
			ctrl.loadCategories();
		}, function (err) {
			toastr.error(err.statusText, 'Error');
		})
	}
	ctrl.editCategory = function (s) {
		ctrl.state = 'edit';
		ctrl.title = 'Edit Category';
		ctrl.editObj = angular.copy(s);
	}
	ctrl.cancelCategory = function () {
		ctrl.state = 'add';
		ctrl.title = 'Add Category';
		ctrl.editObj = {
			id: 0,
			name: null,
			status: 'Inactive',
			icon: null,
			iconImagePath: null,
			deleteIconImage: false,
			color: '#fcb712',
			file: null
		};
		ctrl.file = null;
	}
	// upload image icon
	ctrl.file = null;
	ctrl.setImage = function (file) {
		if (ctrl.editObj === null)
			ctrl.editObj = {};

		ctrl.editObj.file = file;
	}
	ctrl.removeImage = function () {
		ctrl.editObj.file = null;
		ctrl.file = null;
		if (ctrl.editObj.iconImagePath != null) {
			ctrl.editObj.deleteIconImage = true;
			ctrl.editObj.iconImagePath = null;
		}
	}

	ctrl.processing = false;
	ctrl.saveCategory = function (valid) {
		angular.forEach($scope.frmCategory.$$controls, function (field) {
			field.$setDirty();
			field.$validate();
		});
		if (valid) {
			if (ctrl.state == 'add') {
				ctrl.editObj.id = 0;
				ctrl.editObj.displayLayout = null;
			}

			var fd = new FormData();
			fd.append('ID', ctrl.editObj.id);
			fd.append('Status', ctrl.editObj.status);
			fd.append('Name', ctrl.editObj.name);
			fd.append('CategoryTypeID', ctrl.categoryType.id);
			fd.append('Color', ctrl.editObj.color);
			fd.append('Icon', ctrl.editObj.icon);
			fd.append('DeleteIconImage', ctrl.editObj.deleteIconImage);
			fd.append('IconImagePath', ctrl.editObj.iconImagePath);
			fd.append('DisplayLayout', ctrl.editObj.displayLayout);

			if (ctrl.file != null) {
				fd.append('file', ctrl.file);
			} else {
				fd.append('file', null);
			}

			/*for (var pair of fd.entries()) {
				console.log(pair[0]+ ', ' + pair[1]); 
			}*/
			//reset file & state
			ctrl.processing = true;
			$http.post(appSetting.apiBaseUrl + '/api/category/saveCategory', fd, {
				transformRequest: angular.identity,
				headers: {
					'Content-Type': undefined
				}
			}).then(function (r) {
				toastr.success("บันทึกสำเร็จ");
				ctrl.processing = false;
				ctrl.file = null;
				if (ctrl.state == 'add') {
					ctrl.file = null;
					ctrl.resetEditObj();
				}
				$scope.frmCategory.$setPristine();
				$scope.frmCategory.$setUntouched();
				ctrl.loadCategories();
			}, function (err) {
				ctrl.processing = false;
				toastr.error(err.statusText, 'Error');
			});
		}
	}
	ctrl.deleteCategory = function () {

		var found = false;
		angular.forEach(ctrl.categories, function (v, k) {
			if (v.selected) {
				found = true;
			}
		});
		if (!found) {
			toastr.warning('กรุณาเลือกรายการที่ต้องการ', 'Error');
			return;
		}

		var modalInstanceCtrl = ['$scope', '$uibModalInstance', function ($scope, $uibModalInstance) {

			$scope.submit = function () {
				$uibModalInstance.close(true);
			}
			$scope.close = function () {
				$uibModalInstance.close(false);
			}
		}];

		var modalInstance = $uibModal.open({
			animation: true,
			templateUrl: 'confirm-delete.html',
			controller: modalInstanceCtrl,
			backdrop: 'static',
			size: ''
		});

		modalInstance.result.then(function (confirm) {
			if (confirm) {
				var delObjs = [];
				angular.forEach(ctrl.categories, function (v, k) {
					if (v.selected) {
						delObjs.push({
							id: v.id,
							categoryTypeID: ctrl.categoryType.id
						});
					}
				});
				if (delObjs.length > 0) {

					categoryService.deleteCategory(delObjs).then(function (r) {
						toastr.success("ลบรายการสำเร็จ");
						ctrl.loadCategories();
					}, function (err) {
						console.log(err);
						toastr.error(err.statusText + ':' + err.data, 'Error');
					})
				}
				else {
					toastr.warning('กรุณาเลือกรายการที่ต้องการ', 'Error');
				}
			}
		});
	}
	ctrl.updateCategoryPriority = function (s) {

		categoryService.updateCategoryPriority(s.id, s.priority).then(function (r) {
			toastr.success("บันทึกสำเร็จ");
			ctrl.loadCategories();
		}, function (err) {
			toastr.error(err.statusText + ':' + err.data, 'Error');
		});
	}

	ctrl.goto = function (sel) {
		if (sel === 'Dashboard') {
			$state.go('portal.dashboard');
		}
	}

	// load data 
	ctrl.resetEditObj();
	ctrl.loadCategories();
}

angular.module("app").controller("PolicyCategoryCtrl", ['$scope'
	, '$http'
	, '$window'
	, 'toastr'
	, 'authService'
	, '$timeout'
	, '$state'
	, 'categoryService'
	, 'Upload'
	, 'appSetting'
	, '$uibModal', PolicyCategoryCtrl]);
function PolicyCategoryCtrl($scope
	, $http
	, $window
	, toastr
	, authService
	, $timeout
	, $state
	, categoryService
	, Upload
	, appSetting
	, $uibModal) {

	var ctrl = this;
	ctrl.state = 'add';
	ctrl.title = 'Add Category';
	ctrl.categoryType = '';
	ctrl.categories = [];
	ctrl.status = ['Active', 'Inactive'];

	ctrl.editObj = null;
	ctrl.resetEditObj = function () {
		ctrl.editObj = {
			id: 0,
			name: null,
			status: 'Inactive',
			icon: null,
			deleteIconImage: false,
			iconImagePath: null,
			file: null
		};
	}

	ctrl.canView = false;
	ctrl.canEdit = false;
	ctrl.canView = authService.isGranted('view_category_policy');
	ctrl.canEdit = authService.isGranted('modify_category_policy');

	categoryService.getCategoryTypes().then(function (r) {
		angular.forEach(r, function (v, k) {
			if (v.name == 'Policy And Target') {
				ctrl.categoryType = v;
			}
		})
	})
	ctrl.loadCategories = function () {
		categoryService.getPolicyCategories().then(function (r) {
			ctrl.categories = r;
			if (ctrl.editObj.id != 0) {
				angular.forEach(ctrl.categories, function (v, k) {
					if (v.id == ctrl.editObj.id) {
						ctrl.editCategory(v)
					}
				});
			}
		})
	}

	ctrl.toggleAll = function () {
		var toggleStatus = !ctrl.isAllSelected;
		if (toggleStatus) {
			ctrl.showDelete = true;
		} else {
			ctrl.showDelete = false;
		}
		angular.forEach(ctrl.categories, function (itm) {
			itm.selected = toggleStatus;
		});
	}
	ctrl.optionToggled = function () {
		ctrl.isAllSelected = ctrl.categories.every(function (itm) {
			return itm.selected;
		})
		let sel = false;
		angular.forEach(ctrl.categories, function (value, key) {
			if (value.selected) {
				sel = true;
			}
		});
		if (sel)
			ctrl.showDelete = true;
		else
			ctrl.showDelete = false;
	}
	ctrl.updateCategoryStatus = function (r) {
		categoryService.updateCategoryStatus(r.id, r.status).then(function (r) {
			toastr.success("บันทึกสำเร็จ");
			ctrl.loadCategories();
		}, function (err) {
			toastr.error(err.statusText, 'Error');
		})
	}
	ctrl.editCategory = function (s) {
		ctrl.state = 'edit';
		ctrl.title = 'Edit Category';
		ctrl.editObj = angular.copy(s);
	}
	// upload image icon
	ctrl.file = null;
	ctrl.setImage = function (file) {
		if (ctrl.editObj === null)
			ctrl.editObj = {};

		ctrl.editObj.file = file;
	}
	ctrl.removeImage = function () {
		ctrl.editObj.file = null;
		ctrl.file = null;
		if (ctrl.editObj.iconImagePath != null) {
			ctrl.editObj.deleteIconImage = true;
			ctrl.editObj.iconImagePath = null;
		}
	}
	ctrl.cancelCategory = function () {
		ctrl.state = 'add';
		ctrl.title = 'Add Category';
		ctrl.editObj = {
			id: 0,
			name: null,
			status: 'Inactive',
			icon: null,
			iconImagePath: null,
			deleteIconImage: false,
			file: null
		};
		ctrl.file = null;
	}
	ctrl.processing = false;
	ctrl.saveCategory = function (valid) {
		angular.forEach($scope.frmCategory.$$controls, function (field) {
			field.$setDirty();
			field.$validate();
		});
		if (valid) {
			if (ctrl.state == 'add') {
				ctrl.editObj.id = 0;
				ctrl.editObj.displayLayout = null;
			}

			var fd = new FormData();
			fd.append('ID', ctrl.editObj.id);
			fd.append('Status', ctrl.editObj.status);
			fd.append('Name', ctrl.editObj.name);
			fd.append('CategoryTypeID', ctrl.categoryType.id);
			fd.append('Icon', ctrl.editObj.icon);
			fd.append('DeleteIconImage', ctrl.editObj.deleteIconImage);
			fd.append('IconImagePath', ctrl.editObj.iconImagePath);
			fd.append('DisplayLayout', ctrl.editObj.displayLayout);

			if (ctrl.file != null) {
				fd.append('file', ctrl.file);
			} else {
				fd.append('file', null);
			}

			/*for (var pair of fd.entries()) {
				console.log(pair[0]+ ', ' + pair[1]); 
			}*/
			//reset file & state
			ctrl.processing = true;
			$http.post(appSetting.apiBaseUrl + '/api/category/saveCategory', fd, {
				transformRequest: angular.identity,
				headers: {
					'Content-Type': undefined
				}
			}).then(function (r) {
				toastr.success("บันทึกสำเร็จ");
				ctrl.processing = false;
				ctrl.file = null;
				if (ctrl.state == 'add') {
					ctrl.resetEditObj();
				}
				$scope.frmCategory.$setPristine();
				$scope.frmCategory.$setUntouched();
				ctrl.loadCategories();
			}, function (err) {
				ctrl.processing = false;
				toastr.error(err.statusText, 'Error');
			});
		}
	}
	ctrl.deleteCategory = function () {

		var found = false;
		angular.forEach(ctrl.categories, function (v, k) {
			if (v.selected) {
				found = true;
			}
		});
		if (!found) {
			toastr.warning('กรุณาเลือกรายการที่ต้องการ', 'Error');
			return;
		}

		var modalInstanceCtrl = ['$scope', '$uibModalInstance', function ($scope, $uibModalInstance) {

			$scope.submit = function () {
				$uibModalInstance.close(true);
			}
			$scope.close = function () {
				$uibModalInstance.close(false);
			}
		}];

		var modalInstance = $uibModal.open({
			animation: true,
			templateUrl: 'confirm-delete.html',
			controller: modalInstanceCtrl,
			backdrop: 'static',
			size: ''
		});

		modalInstance.result.then(function (confirm) {
			if (confirm) {
				var delObjs = [];
				angular.forEach(ctrl.categories, function (v, k) {
					if (v.selected) {
						delObjs.push({
							id: v.id,
							categoryTypeID: ctrl.categoryType.id
						});
					}
				});
				if (delObjs.length > 0) {

					categoryService.deleteCategory(delObjs).then(function (r) {
						toastr.success("ลบรายการสำเร็จ");
						ctrl.loadCategories();
					}, function (err) {
						console.log(err);
						toastr.error(err.statusText + ':' + err.data, 'Error');
					})
				}
				else {
					toastr.warning('กรุณาเลือกรายการที่ต้องการ', 'Error');
				}
			}
		});
	}
	ctrl.updateCategoryPriority = function (s) {

		categoryService.updateCategoryPriority(s.id, s.priority).then(function (r) {
			toastr.success("บันทึกสำเร็จ");
			ctrl.loadCategories();
		}, function (err) {
			toastr.error(err.statusText + ':' + err.data, 'Error');
		});
	}

	ctrl.goto = function (sel) {
		if (sel === 'Dashboard') {
			$state.go('portal.dashboard');
		}
	}

	// load data 
	ctrl.resetEditObj();
	ctrl.loadCategories();
}

angular.module("app").controller("AboutContentCtrl", ['$scope'
	, '$http'
	, '$window'
	, 'toastr'
	, 'authService'
	, '$timeout'
	, '$state'
	, 'categoryService'
	, 'storageService'
	, 'aboutService'
	, 'appSetting'
	, '$uibModal'
	, 'mediaService'
	, '$stateParams', AboutContentCtrl]);
function AboutContentCtrl($scope
	, $http
	, $window
	, toastr
	, authService
	, $timeout
	, $state
	, categoryService
	, storageService
	, aboutService
	, appSetting
	, $uibModal
	, mediaService
	, $stateParams) {

	var ctrl = this;
	ctrl.stateModel = $stateParams.obj;
	if ($stateParams.obj !== null) {
		storageService.setData('aboutModel', $stateParams.obj);
	}

	if (storageService.getData('aboutModel') !== null && storageService.getData('aboutModel') !== undefined) {
		ctrl.stateModel = storageService.getData('aboutModel');
	}
	ctrl.aboutModel = null;
	ctrl.permissions = [];

	ctrl.canEditAbout = false;
	ctrl.canEditAbout = authService.isGranted('modify_about');

	// tinymce options
	$scope.tinymceOptions = {
		onChange: function (e) {
			// put logic here for keypress and cut/paste changes
		},
		theme: "modern",
		language: 'th_TH',
		menubar: true,
		statusbar: false,
		relative_urls: false,
		// enabled the protocol and host part of the URLs to remain (relative_urls must be false)
		remove_script_host: false,
		document_base_url: appSetting.documentBaseURL,
		font_formats: "Andale Mono=andale mono,times;" +
			"Arial=arial,helvetica,sans-serif;" +
			"Arial Black=arial black,avant garde;" +
			"Book Antiqua=book antiqua,palatino;" +
			"Comic Sans MS=comic sans ms,sans-serif;" +
			"Courier New=courier new,courier;" +
			"Georgia=georgia,palatino;" +
			"Helvetica=helvetica;" +
			"Impact=impact,chicago;" +
			"Symbol=symbol;" +
			"Tahoma=tahoma,arial,helvetica,sans-serif;" +
			"Terminal=terminal,monaco;" +
			"Times New Roman=times new roman,times;" +
			"Trebuchet MS=trebuchet ms,geneva;" +
			"Verdana=verdana,geneva;" +
			"Webdings=webdings;" +
			"Wingdings=wingdings,zapf dingbats;" +
			"supermarket=supermarket",
		fontsize_formats: "8pt 10pt 12pt 14pt 16pt 18pt 20pt 24pt 36pt",
		plugins: [
			"advlist autolink lists link image charmap print preview hr anchor pagebreak",
			"searchreplace wordcount visualblocks visualchars code fullscreen",
			"insertdatetime media nonbreaking save table contextmenu directionality",
			"emoticons template paste textcolor colorpicker textpattern imagetools image"
		],
		toolbar1: "insertfile undo redo | styleselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent |  ",
		toolbar2: "preview media | forecolor backcolor | fontselect fontsizeselect | image link ",
		image_advtab: true,
		style_formats: [
			{ title: 'Line height 20px', selector: 'p,div,h1,h2,h3,h4,h5,h6', styles: { lineHeight: '20px' } },
			{ title: 'Line height 25px', selector: 'p,div,h1,h2,h3,h4,h5,h6', styles: { lineHeight: '25px' } },
			{ title: 'Line height 30px', selector: 'p,div,h1,h2,h3,h4,h5,h6', styles: { lineHeight: '30px' } },
			{ title: 'Line height 35px', selector: 'p,div,h1,h2,h3,h4,h5,h6', styles: { lineHeight: '35px' } },
			{ title: 'Line height 40px', selector: 'p,div,h1,h2,h3,h4,h5,h6', styles: { lineHeight: '40px' } }
		],
		//height: 300
		//| code
	};

	aboutService.getAboutMaster().then(function (r) {
		ctrl.permissions = r.permissions;
		ctrl.getEditAboutContent(ctrl.stateModel.id);
	});

	ctrl.getEditAboutContent = function (id) {
		aboutService.getAboutContent(id).then(function (r) {
			ctrl.aboutModel = r;
			ctrl.aboutModel.selectedPermission = null;
			angular.forEach(ctrl.permissions, function (value, key) {
				if (r.accessGroupID === value.id)
					ctrl.aboutModel.selectedPermission = value;
			});
		}, function (e) {
			toastr.error(e.statusText, 'Error');
		});
	}

	ctrl.goto = function (r) {
		$state.go(r);
	}
	ctrl.saveAboutContent = function () {
		ctrl.processing = true;
		let obj = {
			id: ctrl.aboutModel.id,
			active: ctrl.aboutModel.active,
			categoryID: ctrl.stateModel.id,
			title: ctrl.stateModel.name,
			content: ctrl.aboutModel.content,
			accessGroupID: ctrl.aboutModel.selectedPermission.id
		}
		aboutService.updateAboutContent(obj).then(function (r) {
			toastr.success("บันทึกสำเร็จ");
			ctrl.processing = false;
			ctrl.getEditAboutContent(ctrl.stateModel.id);
		}, function (err) {
			ctrl.processing = false;
			toastr.error(err.statusText, 'Error');
		});
	}

	ctrl.uploadMedia = function () {
		var modalInstanceCtrl = ['$scope', '$uibModalInstance', '$http', 'toastr', 'appSetting', 'mediaService', 'clipboard', function ($scope, $uibModalInstance, $http, toastr, appSetting, mediaService, clipboard) {
			$scope.files = [];
			$scope.processing = false;
			$scope.medias = [];

			setTimeout(function () {
				clearFileUpload();
			}, 200);

			$scope.pageSizes = [10, 20, 50, 100];
			$scope.totalPage = 0;
			$scope.criteria = {
				pageNumber: 1,
				pageSize: $scope.pageSizes[0],
				total: 0
			}
			$scope.searchMediaList = function () {
				mediaService.searchMediaFile($scope.criteria).then(function (r) {
					$scope.medias = r.mediaFiles;
					$scope.criteria.total = r.total;

					let x = Math.floor(r.total / $scope.criteria.pageSize);
					if ((r.total % $scope.criteria.pageSize) >= 1)
						x = x + 1;

					$scope.totalPage = x;
					$scope.criteria.pageNumber = r.pageNumber;
				});
			}
			$scope.searchMediaList();

			$scope.previousPage = function () {
				if ($scope.criteria.pageNumber > 1 && $scope.totalPage > 1) {
					$scope.criteria.pageNumber = $scope.criteria.pageNumber - 1;
					ctrl.searchMediaList();
				}
			}
			$scope.nextPage = function () {
				if ($scope.criteria.pageNumber >= 1 && ($scope.criteria.pageNumber < $scope.totalPage)) {
					$scope.criteria.pageNumber = $scope.criteria.pageNumber + 1;
					$scope.searchMediaList();
				}
			}
			$scope.changePageSize = function () {
				$scope.criteria.pageNumber = 1;
				$scope.searchMediaList();
			}

			$scope.showDelete = false;
			$scope.toggleAll = function () {
				var toggleStatus = !$scope.isAllSelected;
				if (toggleStatus) {
					$scope.showDelete = true;
				} else {
					$scope.showDelete = false;
				}
				angular.forEach($scope.medias, function (itm) { itm.selected = toggleStatus; });
			}
			$scope.optionToggled = function () {
				$scope.isAllSelected = $scope.medias.every(function (itm) {
					return itm.selected;
				})
				let sel = false;
				angular.forEach($scope.medias, function (value, key) {
					if (value.selected) {
						sel = true;
					}
				});
				if (sel)
					$scope.showDelete = true;
				else
					$scope.showDelete = false;
			}

			$scope.submit = function () {
				$uibModalInstance.close(true);
			}
			if (!clipboard.supported) {
				console.log('Sorry, copy to clipboard is not supported');
			}
			$scope.copyLink = function (s) {
				clipboard.copyText(s.fileURL);
				toastr.info('Copied link: ' + s.fileURL, 'Info');
			}

			$scope.uploadFile = function () {

				if ($scope.files && $scope.files.length > 0) {
					var fd = new FormData();
					fd.append('module', "about");
					angular.forEach($scope.files, function (value, key) {
						fd.append('files', value);
					});
					$scope.processing = true;
					$http.post(appSetting.apiBaseUrl + '/api/media/uploadMedia', fd, {
						transformRequest: angular.identity,
						headers: {
							'Content-Type': undefined
						}
					}).then(function (r) {
						$scope.files = [];
						clearFileUpload();
						$scope.criteria.pageNumber = 1;
						$scope.searchMediaList();
						$scope.processing = false;
						toastr.success("บันทึกสำเร็จ");
					}, function (err) {
						$scope.processing = false;
						$scope.files = [];
						toastr.error(err.statusText, 'Error');
					});
				}
			}

			$scope.deletes = function () {

				var modalInstanceCtrl = ['$scope', '$uibModalInstance', 'mediaService', function ($scope, $uibModalInstance, mediaService) {
					$scope.submit = function () {
						$uibModalInstance.close(true);
					}
					$scope.close = function () {
						$uibModalInstance.close(false);
					}
				}];

				var modalInstance = $uibModal.open({
					animation: true,
					templateUrl: 'confirm-delete.html',
					controller: modalInstanceCtrl,
					backdrop: 'static',
					size: ''
				});

				modalInstance.result.then(function (confirmed) {
					if (confirmed) {
						let deletedIds = [];
						angular.forEach($scope.medias, function (value, key) {
							if (value.selected) {
								deletedIds.push(value.id);
							}
						});
						if (deletedIds.length > 0) {
							$scope.processing = true;
							mediaService.deleteMedias(deletedIds).then(function (r) {
								$scope.processing = false;
								toastr.success("ลบรายการสำเร็จ");
								$scope.criteria.pageNumber = 1;
								$scope.showDelete = false;
								$scope.searchMediaList();
							}, function (err) {
								$scope.processing = false;
								toastr.error(err.statusText, 'Error');
							});
						}
					}
				});
			}

			$scope.close = function () {
				$uibModalInstance.close(false);
			}
		}];

		var modalInstance = $uibModal.open({
			animation: true,
			templateUrl: 'upload-media.html',
			controller: modalInstanceCtrl,
			backdrop: 'static',
			size: 'lg'
		});

		modalInstance.result.then(function (confirm) {
			if (confirm) {

			}
		});
	}
}

angular.module("app").controller("ApplicationsCtrl", ['$scope'
	, '$http'
	, '$window'
	, 'toastr'
	, 'authService'
	, 'applicationService'
	, '$state'
	, '$timeout'
	, '$uibModal', ApplicationsCtrl]);
function ApplicationsCtrl($scope, $http, $window, toastr, authService, applicationService, $state, $timeout, $uibModal) {
	var ctrl = this;

	ctrl.permissions = [];
	ctrl.categories = [];

	ctrl.status = ['All', 'Active', 'Inactive'];
	ctrl.pageSizes = [20, 50, 100, 200];
	ctrl.totalPage = 0;
	ctrl.priorities = [];
	ctrl.criteria = {
		applicationName: '',
		selectedCategory: null,
		selectedPermission: null,
		selectedStatus: ctrl.status[0],
		pageNumber: 1,
		pageSize: ctrl.pageSizes[0],
		total: 0,
		sortingOrder: 'n.[Priority]',
		reverse: false,
		results: []
	}

	// chang sorting order
	ctrl.sort_by = function (newSortingOrder) {
		if (ctrl.criteria.sortingOrder == newSortingOrder)
			ctrl.criteria.reverse = !ctrl.criteria.reverse;

		ctrl.criteria.sortingOrder = newSortingOrder;

		ctrl.search(true);
	};
	ctrl.goto = function (sel, obj) {
		if (sel === 'Dashboard') {
			$state.go('portal.dashboard');
		} else if (sel === 'AllApplications') {
			$state.go('portal.applications');
		} else if (sel === 'AddApplication') {
			$state.go('portal.editapplication', { obj: { mode: 'add', data: null } });
		} else if (sel === 'EditApplication') {
			$state.go('portal.editapplication', { obj: { mode: 'edit', data: obj } });
		}
	}

	ctrl.canEditApplications = false;
	ctrl.canViewApplications = false;
	ctrl.canViewApplications = authService.isGranted('view_applications');
	ctrl.canEditApplications = authService.isGranted('modify_applications');

	ctrl.getApplicationSearchCriteria = function () {
		applicationService.getApplicationSearchCriteria().then(function (r) {
			ctrl.permissions = r.permissions;
			ctrl.categories = r.categories;
			ctrl.criteria.selectedCategory = ctrl.categories[0];
			ctrl.criteria.selectedPermission = ctrl.permissions[0];
			ctrl.search();
		}, function (err) {
			if (err.data)
				toastr.error(err.data.MessageDetail, 'Error');
			else
				toastr.error(err.Message, 'Error');
		});
	}

	ctrl.search = function (isClickSearch) {
		$('#searchresult').block({
			message: loading,
			css: { border: '0px', backgroundColor: 'none', fontSize: '0.4em' }
		});
		if (isClickSearch) {
			ctrl.criteria.pageNumber = 1;
			ctrl.criteria.pageSize = ctrl.pageSizes[0];
		}
		applicationService.searchApplications(ctrl.criteria).then(function (r) {
			$('#searchresult').unblock();
			ctrl.criteria.total = r.total;
			ctrl.criteria.results = r.applications;
			let x = Math.floor(r.total / ctrl.criteria.pageSize);
			if ((r.total % ctrl.criteria.pageSize) >= 1)
				x = x + 1;

			ctrl.totalPage = x;

		}, function (err) {
			toastr.error(err.statusText, 'Error');
		});
	}
	ctrl.updateStatus = function (r) {
		$('#searchresult').block({
			message: loading,
			css: { border: '0px', backgroundColor: 'none', fontSize: '0.4em' }
		});
		applicationService.updateStatus({
			id: r.id,
			status: r.status == 'Active'
		}).then(function (r) {
			toastr.success("บันทึกสำเร็จ");
			ctrl.search(true);
		}, function (err) {
			ctrl.processing = false;
			toastr.error(err.statusText, 'Error');
			$('#searchresult').unblock();
		});
		// console.log(r);

	}

	ctrl.clearSearch = function () {
		ctrl.criteria = {
			applicationName: '',
			selectedCategory: ctrl.categories[0],
			selectedPermission: ctrl.permissions[0],
			selectedStatus: ctrl.status[0],
			pageNumber: 1,
			pageSize: ctrl.pageSizes[0],
			total: 0,
			sortingOrder: 'n.[Priority]',
			reverse: false
		}
		ctrl.search();
	}
	ctrl.previousPage = function () {
		if (ctrl.criteria.pageNumber > 1 && ctrl.totalPage > 1) {
			ctrl.criteria.pageNumber = ctrl.criteria.pageNumber - 1;
			ctrl.search();
		}
	}
	ctrl.nextPage = function () {
		if (ctrl.criteria.pageNumber >= 1 && (ctrl.criteria.pageNumber < ctrl.totalPage)) {
			ctrl.criteria.pageNumber = ctrl.criteria.pageNumber + 1;
			ctrl.search();
		}
	}
	ctrl.changePageSize = function () {
		ctrl.criteria.pageNumber = 1;
		ctrl.search();
	}
	ctrl.updateApplicationPriority = function (id, priority) {
		applicationService.updateApplicationPriority(id, priority).then(function (r) {
			ctrl.search();
			toastr.success("บันทึกสำเร็จ");
		}, function (err) {
			toastr.error(err.statusText, 'Error');
		});
	}
	ctrl.showDelete = false;
	ctrl.toggleAll = function () {
		var toggleStatus = !ctrl.isAllSelected;
		if (toggleStatus) {
			ctrl.showDelete = true;
		} else {
			ctrl.showDelete = false;
		}
		angular.forEach(ctrl.criteria.results, function (itm) { itm.selected = toggleStatus; });
	}
	ctrl.optionToggled = function () {
		ctrl.isAllSelected = ctrl.criteria.results.every(function (itm) {
			return itm.selected;
		})
		let sel = false;
		angular.forEach(ctrl.criteria.results, function (value, key) {
			if (value.selected) {
				sel = true;
			}
		});
		if (sel)
			ctrl.showDelete = true;
		else
			ctrl.showDelete = false;
	}
	ctrl.deleteApplications = function () {

		var modalInstanceCtrl = ['$scope', '$uibModalInstance', function ($scope, $uibModalInstance) {
			$scope.submit = function () {
				$uibModalInstance.close(true);
			}
			$scope.close = function () {
				$uibModalInstance.close(false);
			}
		}];

		var modalInstance = $uibModal.open({
			animation: true,
			templateUrl: 'confirm-delete.html',
			controller: modalInstanceCtrl,
			backdrop: 'static',
			size: ''
		});

		modalInstance.result.then(function (confirmed) {
			if (confirmed) {
				let deletedIds = [];
				angular.forEach(ctrl.criteria.results, function (value, key) {
					if (value.selected) {
						deletedIds.push(value.id);
					}
				});
				if (deletedIds.length > 0) {
					ctrl.processing = true;
					applicationService.deleteApplications(deletedIds).then(function (r) {
						ctrl.processing = false;
						toastr.success("ลบรายการสำเร็จ");
						ctrl.search();
					}, function (err) {
						ctrl.processing = false;
						toastr.error(err.statusText, 'Error');
					});
				}
			}
		});

	}

	// init data
	ctrl.getApplicationSearchCriteria();

}

angular.module("app").controller("EditApplication", ['$scope'
	, '$http'
	, '$window'
	, 'toastr'
	, 'authService'
	, 'applicationService'
	, '$state'
	, '$stateParams'
	, 'storageService'
	, '$timeout'
	, '$uibModal'
	, 'appSetting', EditApplication]);
function EditApplication($scope, $http, $window, toastr, authService, applicationService, $state, $stateParams, storageService, $timeout, $uibModal, Upload, appSetting) {
	var ctrl = this;
	ctrl.applicationNameMaxLength = 200;
	ctrl.descMaxLength = 1000;

	ctrl.title = "Add Applications";
	ctrl.applicationModel = null;
	ctrl.processing = false;
	ctrl.stateModel = $stateParams.obj;
	if ($stateParams.obj !== null) {
		storageService.setData('stateApplicationModel', $stateParams.obj);
	}

	if (storageService.getData('stateApplicationModel') !== null && storageService.getData('stateApplicationModel') !== undefined) {
		ctrl.stateModel = storageService.getData('stateApplicationModel');
	}

	ctrl.goto = function (sel, obj) {
		if (sel === 'Dashboard') {
			$state.go('portal.dashboard');
		} else if (sel === 'AllApplications') {
			$state.go('portal.applications');
		}
	}

	ctrl.canEditApplications = false;
	ctrl.canViewApplications = false;
	ctrl.canViewApplications = authService.isGranted('view_applications');
	ctrl.canEditApplications = authService.isGranted('modify_applications');

	// load master
	applicationService.getApplicationMaster().then(function (r) {

		ctrl.permissions = r.permissions;
		ctrl.categories = r.categories;
		// switch binding
		if (ctrl.stateModel.mode === 'add') {
			ctrl.title = "Add Applications";
			ctrl.applicationModel = {
				id: 0,
				systemName: null,
				systemDescription: '',
				systemURL: '',
				status: true,
				selectedCategory: ctrl.categories[0],
				selectedPermission: ctrl.permissions[0]
			};
		}
		else if (ctrl.stateModel.mode === 'edit') {
			ctrl.title = "Edit Applications";
			let id = ctrl.stateModel.data.id;
			ctrl.getEditApplicationsData(id)
		}
	}, function (err) {
		toastr.error(err.statusText, 'Error');
	});

	ctrl.getEditApplicationsData = function (id) {
		ctrl.title = "Edit Applications";
		applicationService.getEditApplicationsByID(id).then(function (r) {
			ctrl.applicationModel = {
				id: r.id,
				systemName: r.systemName,
				systemDescription: r.systemDescription,
				systemURL: r.systemURL,
				status: r.status,
				selectedCategory: null,
				selectedPermission: null,
				updatedDate: r.updatedDate,
				updatedBy: r.updatedBy,
				createdDate: r.createdDate,
				createdBy: r.createdBy
			};

			angular.forEach(ctrl.categories, function (value, key) {
				if (r.categoryID === value.id)
					ctrl.applicationModel.selectedCategory = value;
			});
			angular.forEach(ctrl.permissions, function (value, key) {
				if (r.accessGroupID === value.id)
					ctrl.applicationModel.selectedPermission = value;
			});
		}, function (err) {
			toastr.error(err.statusText, 'Error');
		});
	}

	ctrl.submitApplication = function (valid) {
		angular.forEach($scope.frmEdit.$$controls, function (field) {
			field.$setDirty();
			field.$validate();
		});
		if (valid) {

			ctrl.processing = true;
			let postObj = {
				id: ctrl.applicationModel.id,
				systemName: ctrl.applicationModel.systemName,
				systemDescription: ctrl.applicationModel.systemDescription,
				systemURL: ctrl.applicationModel.systemURL,
				status: ctrl.applicationModel.status,
				categoryID: ctrl.applicationModel.selectedCategory.id,
				accessGroupID: ctrl.applicationModel.selectedPermission.id
			}
			applicationService.saveApplications(postObj).then(function (r) {
				toastr.success("บันทึกสำเร็จ");
				ctrl.processing = false;
				ctrl.getEditApplicationsData(r.id);
			}, function (err) {
				ctrl.processing = false;
				toastr.error(err.statusText, 'Error');
			});
		}
	}
}
angular.module("app").controller("PolicyCtrl", ['$scope'
	, '$http'
	, '$window'
	, 'toastr'
	, 'authService'
	, 'policyService'
	, '$state'
	, '$timeout'
	, '$uibModal', PolicyCtrl]);
function PolicyCtrl($scope, $http, $window, toastr, authService, policyService, $state, $timeout, $uibModal) {
	var ctrl = this;

	ctrl.permissions = [];
	ctrl.categories = [];
	ctrl.status = ['All', 'Active', 'Inactive'];
	ctrl.pageSizes = [20, 50, 100, 200];
	ctrl.totalPage = 0;
	ctrl.priorities = [];
	ctrl.criteria = {
		topic: '',
		selectedCategory: null,
		selectedPermission: null,
		selectedStatus: ctrl.status[0],
		pageNumber: 1,
		pageSize: ctrl.pageSizes[0],
		total: 0,
		sortingOrder: 'n.[Priority]',
		reverse: false,
		results: []
	}

	ctrl.canView = false;
	ctrl.canEdit = false;
	ctrl.canView = authService.isGranted('view_policy');
	ctrl.canEdit = authService.isGranted('modify_policy');

	ctrl.goto = function (sel, obj) {
		if (sel === 'Dashboard') {
			$state.go('portal.dashboard');
		} else if (sel === 'AllPolicies') {
			$state.go('portal.policies');
		} else if (sel === 'AddPolicy') {
			$state.go('portal.editpolicy', { obj: { mode: 'add', data: null } });
		} else if (sel === 'EditPolicy') {
			$state.go('portal.editpolicy', { obj: { mode: 'edit', data: obj } });
		}
	}
	ctrl.getPolicySearchCriteria = function () {
		policyService.getPolicySearchCriteria().then(function (r) {
			ctrl.permissions = r.permissions;
			ctrl.categories = r.categories;
			ctrl.criteria.selectedCategory = ctrl.categories[0];
			ctrl.criteria.selectedPermission = ctrl.permissions[0];
			ctrl.search();
		}, function (err) {
			if (err.data)
				toastr.error(err.data.MessageDetail, 'Error');
			else
				toastr.error(err.Message, 'Error');
		});
	}

	// chang sorting order
	ctrl.sort_by = function (newSortingOrder) {
		if (ctrl.criteria.sortingOrder == newSortingOrder)
			ctrl.criteria.reverse = !ctrl.criteria.reverse;

		ctrl.criteria.sortingOrder = newSortingOrder;

		ctrl.search(true);
	};

	ctrl.search = function (isClickSearch) {
		$('#searchresult').block({
			message: loading,
			css: { border: '0px', backgroundColor: 'none', fontSize: '0.4em' }
		});
		if (isClickSearch) {
			ctrl.criteria.pageNumber = 1;
			ctrl.criteria.pageSize = ctrl.pageSizes[0];
		}
		policyService.searchPolicies(ctrl.criteria).then(function (r) {
			$('#searchresult').unblock();
			ctrl.criteria.total = r.total;
			ctrl.criteria.results = r.policies;
			let x = Math.floor(r.total / ctrl.criteria.pageSize);
			if ((r.total % ctrl.criteria.pageSize) >= 1)
				x = x + 1;

			ctrl.totalPage = x;

		}, function (err) {
			toastr.error(err.statusText, 'Error');
		});
	}

	ctrl.clearSearch = function () {
		ctrl.criteria = {
			topic: '',
			selectedCategory: ctrl.categories[0],
			selectedPermission: ctrl.permissions[0],
			selectedStatus: ctrl.status[0],
			pageNumber: 1,
			pageSize: ctrl.pageSizes[0],
			sortingOrder: 'n.[Priority]',
			reverse: false,
			total: 0
		}
		ctrl.search();
	}
	ctrl.updateStatus = function (r) {
		$('#searchresult').block({
			message: loading,
			css: { border: '0px', backgroundColor: 'none', fontSize: '0.4em' }
		});
		policyService.updateStatus({
			id: r.id,
			status: r.status == 'Active'
		}).then(function (r) {
			toastr.success("บันทึกสำเร็จ");
			ctrl.search(true);
		}, function (err) {
			ctrl.processing = false;
			toastr.error(err.statusText, 'Error');
			$('#searchresult').unblock();
		});
		// console.log(r);

	}
	ctrl.previousPage = function () {
		if (ctrl.criteria.pageNumber > 1 && ctrl.totalPage > 1) {
			ctrl.criteria.pageNumber = ctrl.criteria.pageNumber - 1;
			ctrl.search();
		}
	}
	ctrl.nextPage = function () {
		if (ctrl.criteria.pageNumber >= 1 && (ctrl.criteria.pageNumber < ctrl.totalPage)) {
			ctrl.criteria.pageNumber = ctrl.criteria.pageNumber + 1;
			ctrl.search();
		}
	}
	ctrl.changePageSize = function () {
		ctrl.criteria.pageNumber = 1;
		ctrl.search();
	}
	ctrl.updatePolicyPriority = function (id, priority) {
		policyService.updatePolicyPriority(id, priority).then(function (r) {
			ctrl.search();
			toastr.success("บันทึกสำเร็จ");
		}, function (err) {
			toastr.error(err.statusText, 'Error');
		});
	}
	ctrl.showDelete = false;
	ctrl.toggleAll = function () {
		var toggleStatus = !ctrl.isAllSelected;
		if (toggleStatus) {
			ctrl.showDelete = true;
		} else {
			ctrl.showDelete = false;
		}
		angular.forEach(ctrl.criteria.results, function (itm) { itm.selected = toggleStatus; });
	}
	ctrl.optionToggled = function () {
		ctrl.isAllSelected = ctrl.criteria.results.every(function (itm) {
			return itm.selected;
		})
		let sel = false;
		angular.forEach(ctrl.criteria.results, function (value, key) {
			if (value.selected) {
				sel = true;
			}
		});
		if (sel)
			ctrl.showDelete = true;
		else
			ctrl.showDelete = false;
	}
	ctrl.deletePolicies = function () {

		var modalInstanceCtrl = ['$scope', '$uibModalInstance', function ($scope, $uibModalInstance) {
			$scope.submit = function () {
				$uibModalInstance.close(true);
			}
			$scope.close = function () {
				$uibModalInstance.close(false);
			}
		}];

		var modalInstance = $uibModal.open({
			animation: true,
			templateUrl: 'confirm-delete.html',
			controller: modalInstanceCtrl,
			backdrop: 'static',
			size: ''
		});

		modalInstance.result.then(function (confirmed) {
			if (confirmed) {
				let deletedIds = [];
				angular.forEach(ctrl.criteria.results, function (value, key) {
					if (value.selected) {
						deletedIds.push(value.id);
					}
				});
				if (deletedIds.length > 0) {
					ctrl.processing = true;
					policyService.deletePolicies(deletedIds).then(function (r) {
						ctrl.processing = false;
						toastr.success("ลบรายการสำเร็จ");
						ctrl.search();
					}, function (err) {
						ctrl.processing = false;
						toastr.error(err.statusText, 'Error');
					});
				}
			}
		});

	}

	// init data
	ctrl.getPolicySearchCriteria();

}



angular.module("app").controller("DefaultCoverImageCtrl", ['$scope'
	, '$http'
	, '$window'
	, 'toastr'
	, 'authService'
	, 'defaultCoverImageService'
	, '$state'
	, '$timeout'
	, '$uibModal', DefaultCoverImageCtrl]);
function DefaultCoverImageCtrl($scope, $http, $window, toastr, authService, defaultCoverImageService, $state, $timeout, $uibModal) {
	var ctrl = this;

	ctrl.permissions = [];
	ctrl.categories = [];
	ctrl.status = ['All', 'Active', 'Inactive'];
	ctrl.pageSizes = [20, 50, 100, 200];
	ctrl.totalPage = 0;
	ctrl.priorities = [];
	ctrl.criteria = {
		pageNumber: 1,
		pageSize: ctrl.pageSizes[0],
		total: 0,
		sortingOrder: 'menu',
		reverse: false,
		results: []
	}

	ctrl.canView = false;
	ctrl.canEdit = false;
	ctrl.canView = authService.isGranted('view_policy');
	ctrl.canEdit = authService.isGranted('modify_policy');

	ctrl.goto = function (sel, obj) {
		if (sel === 'Dashboard') {
			$state.go('portal.dashboard');
		} else if (sel === 'AllPolicies') {
			$state.go('portal.policies');
		} else if (sel === 'AddPolicy') {
			$state.go('portal.editpolicy', { obj: { mode: 'add', data: null } });
		} else if (sel === 'EditPolicy') {
			$state.go('portal.editpolicy', { obj: { mode: 'edit', data: obj } });
		}
	}

	// chang sorting order
	ctrl.sort_by = function (newSortingOrder) {
		if (ctrl.criteria.sortingOrder == newSortingOrder)
			ctrl.criteria.reverse = !ctrl.criteria.reverse;

		ctrl.criteria.sortingOrder = newSortingOrder;

		ctrl.search(true);
	};

	ctrl.search = function (isClickSearch) {
		$('#searchresult').block({
			message: loading,
			css: { border: '0px', backgroundColor: 'none', fontSize: '0.4em' }
		});
		if (isClickSearch) {
			ctrl.criteria.pageNumber = 1;
			ctrl.criteria.pageSize = ctrl.pageSizes[0];
		}
		defaultCoverImageService.searchDefaultCoverImage(ctrl.criteria).then(function (r) {
			$('#searchresult').unblock();
			ctrl.criteria.total = r.total;
			ctrl.criteria.results = r.coverImages;
			let x = Math.floor(r.total / ctrl.criteria.pageSize);
			if ((r.total % ctrl.criteria.pageSize) >= 1)
				x = x + 1;

			ctrl.totalPage = x;

		}, function (err) {
			toastr.error(err.statusText, 'Error');
		});
	}

	ctrl.clearSearch = function () {
		ctrl.criteria = {
			pageNumber: 1,
			pageSize: ctrl.pageSizes[0],
			sortingOrder: 'menu',
			reverse: false,
			total: 0
		}
		alert(11)
		ctrl.search();
	}
	ctrl.updateStatus = function (r) {
		$('#searchresult').block({
			message: loading,
			css: { border: '0px', backgroundColor: 'none', fontSize: '0.4em' }
		});
		policyService.updateStatus({
			id: r.id,
			status: r.status == 'Active'
		}).then(function (r) {
			toastr.success("บันทึกสำเร็จ");
			ctrl.search(true);
		}, function (err) {
			ctrl.processing = false;
			toastr.error(err.statusText, 'Error');
			$('#searchresult').unblock();
		});
		// console.log(r);

	}
	ctrl.previousPage = function () {
		if (ctrl.criteria.pageNumber > 1 && ctrl.totalPage > 1) {
			ctrl.criteria.pageNumber = ctrl.criteria.pageNumber - 1;
			ctrl.search();
		}
	}
	ctrl.nextPage = function () {
		if (ctrl.criteria.pageNumber >= 1 && (ctrl.criteria.pageNumber < ctrl.totalPage)) {
			ctrl.criteria.pageNumber = ctrl.criteria.pageNumber + 1;
			ctrl.search();
		}
	}
	ctrl.changePageSize = function () {
		ctrl.criteria.pageNumber = 1;
		ctrl.search();
	}
	ctrl.updatePolicyPriority = function (id, priority) {
		policyService.updatePolicyPriority(id, priority).then(function (r) {
			ctrl.search();
			toastr.success("บันทึกสำเร็จ");
		}, function (err) {
			toastr.error(err.statusText, 'Error');
		});
	}
	ctrl.showDelete = false;
	ctrl.toggleAll = function () {
		var toggleStatus = !ctrl.isAllSelected;
		if (toggleStatus) {
			ctrl.showDelete = true;
		} else {
			ctrl.showDelete = false;
		}
		angular.forEach(ctrl.criteria.results, function (itm) { itm.selected = toggleStatus; });
	}
	ctrl.optionToggled = function () {
		ctrl.isAllSelected = ctrl.criteria.results.every(function (itm) {
			return itm.selected;
		})
		let sel = false;
		angular.forEach(ctrl.criteria.results, function (value, key) {
			if (value.selected) {
				sel = true;
			}
		});
		if (sel)
			ctrl.showDelete = true;
		else
			ctrl.showDelete = false;
	}
	ctrl.deletePolicies = function () {

		var modalInstanceCtrl = ['$scope', '$uibModalInstance', function ($scope, $uibModalInstance) {
			$scope.submit = function () {
				$uibModalInstance.close(true);
			}
			$scope.close = function () {
				$uibModalInstance.close(false);
			}
		}];

		var modalInstance = $uibModal.open({
			animation: true,
			templateUrl: 'confirm-delete.html',
			controller: modalInstanceCtrl,
			backdrop: 'static',
			size: ''
		});

		modalInstance.result.then(function (confirmed) {
			if (confirmed) {
				let deletedIds = [];
				angular.forEach(ctrl.criteria.results, function (value, key) {
					if (value.selected) {
						deletedIds.push(value.id);
					}
				});
				if (deletedIds.length > 0) {
					ctrl.processing = true;
					policyService.deletePolicies(deletedIds).then(function (r) {
						ctrl.processing = false;
						toastr.success("ลบรายการสำเร็จ");
						ctrl.search();
					}, function (err) {
						ctrl.processing = false;
						toastr.error(err.statusText, 'Error');
					});
				}
			}
		});

	}

	ctrl.goto = function (sel, obj) {
		if (sel === 'EditCoverImage') {
			$state.go('portal.editCoverImage', { obj: { mode: 'edit', data: obj } });
			}
	}
	// init data

	ctrl.search(false);

}


angular.module("app").controller("EditDefaultCoverImageCtrl", ['$scope', '$http', '$window', 'toastr', 'authService', 'policyService', '$state', '$stateParams', 'storageService', '$timeout', '$uibModal', 'Upload', 'appSetting', EditDefaultCoverImageCtrl]);
function EditDefaultCoverImageCtrl($scope, $http, $window, toastr, authService, policyService, $state, $stateParams, storageService, $timeout, $uibModal, Upload, appSetting) {
	var ctrl = this;
	ctrl.topicMaxLength = 200;

	ctrl.title = "Add Policy & Target";
	ctrl.policyModel = null;
	ctrl.processing = false;

	ctrl.stateModel = $stateParams.obj;
	
	if ($stateParams.obj !== null) {
		storageService.setData('defaultCoverModel', $stateParams.obj);
	}

	if (storageService.getData('defaultCoverModel') !== null && storageService.getData('defaultCoverModel') !== undefined) {
		ctrl.stateModel = storageService.getData('defaultCoverModel');
	}
	console.log(ctrl.stateModel);
	ctrl.editObj=ctrl.stateModel.data;
	ctrl.editObj.file=null;
	ctrl.canView = true;
	ctrl.canEdit = true;
	// ctrl.canView = authService.isGranted('view_policy');
	// ctrl.canEdit = authService.isGranted('modify_policy');
	ctrl.setImage = function (file) {
		if (ctrl.editObj === null)
			ctrl.editObj = {};

		ctrl.editObj.file = file;
	}
	ctrl.goto = function (sel, obj) {
		if (sel === 'Dashboard') {
			$state.go('portal.dashboard');
		} else if (sel === 'AllPolicy') {
			$state.go('portal.policies');
		}
	}
	ctrl.setImage = function (file) {
		if (ctrl.editObj === null)
			ctrl.editObj = {};

		ctrl.editObj.file = file;
	}

	
	// image cropper
	ctrl.deleteCoverImage = function () {
		ctrl.policyModel.thumbnail = 'images/nopic.png';
	}


	
	ctrl.selectFile = function () {
	}
	ctrl.removeImage = function () {
		ctrl.editObj.file = null;
		ctrl.file = null;
		if (ctrl.editObj.thumbnail != null) {
			ctrl.editObj.deleteIconImage = true;
			ctrl.editObj.thumbnail = null;
		}
	}
	ctrl.submitDefaultCoverImage = function (valid) {
		angular.forEach($scope.frmEdit.$$controls, function (field) {
			field.$setDirty();
			field.$validate();
		});
		if (valid) {
		
			var fd = new FormData();
			if(ctrl.editObj.file!=null){
				fd.append('id',ctrl.editObj.id);
				fd.append('files', ctrl.editObj.file);
				ctrl.file = null;
				ctrl.processing = true;
				$http.post(appSetting.apiBaseUrl + '/api/coverImage/saveCoverImage', fd,{
					transformRequest: angular.identity,
					headers: {
						'Content-Type': undefined
					}
				}).then(function (r) {
					toastr.success("บันทึกสำเร็จ");
					ctrl.processing = false;
				}, function (err) {
					ctrl.processing = false;
					toastr.error(err.statusText, 'Error');
				});
			}else{
				toastr.success("บันทึกสำเร็จ");
			}


		
			// reset file browsing
			
		}
	}
	
	ctrl.goto = function (sel, obj) {
		if (sel === 'CoverImage') {
			$state.go('portal.coverImage');
		} 
	}
}
angular.module("app").controller("EditPolicyCtrl", ['$scope', '$http', '$window', 'toastr', 'authService', 'policyService', '$state', '$stateParams', 'storageService', '$timeout', '$uibModal', 'Upload', 'appSetting', EditPolicyCtrl]);
function EditPolicyCtrl($scope, $http, $window, toastr, authService, policyService, $state, $stateParams, storageService, $timeout, $uibModal, Upload, appSetting) {
	var ctrl = this;
	ctrl.topicMaxLength = 200;

	ctrl.title = "Add Policy & Target";
	ctrl.policyModel = null;
	ctrl.processing = false;

	ctrl.stateModel = $stateParams.obj;
	console.log($stateParams.obj);
	if ($stateParams.obj !== null) {
		storageService.setData('policyModel', $stateParams.obj);
	}

	if (storageService.getData('policyModel') !== null && storageService.getData('policyModel') !== undefined) {
		ctrl.stateModel = storageService.getData('policyModel');
	}

	ctrl.canView = false;
	ctrl.canEdit = false;
	ctrl.canView = authService.isGranted('view_policy');
	ctrl.canEdit = authService.isGranted('modify_policy');

	ctrl.goto = function (sel, obj) {
		if (sel === 'Dashboard') {
			$state.go('portal.dashboard');
		} else if (sel === 'AllPolicy') {
			$state.go('portal.policies');
		}
	}

	// load master
	policyService.getPolicyMaster().then(function (r) {
		ctrl.permissions = r.permissions;
		ctrl.categories = r.categories;

		// switch binding
		if (ctrl.stateModel.mode === 'add') {
			ctrl.title = "Add Policy & Target";
			ctrl.policyModel = {
				id: 0,
				topic: null,
				documentDate: getCurrentDateStr(),
				status: true,
				fileName: null,
				thumbnail: 'images/nopic.png',
				selectedCategory: ctrl.categories[0],
				selectedPermission: ctrl.permissions[0]
			};
		}
		else if (ctrl.stateModel.mode === 'edit') {
			ctrl.title = "Edit Policy & Target";
			let id = ctrl.stateModel.data.id;
			ctrl.getEditPolicyData(id)
		}
	}, function (err) {
		toastr.error(err.statusText, 'Error');
	});
	var img = document.getElementById("my-cover-image");
	ctrl.current_size = (img.naturalWidth + 'x' + img.naturalHeight);
	console.log(ctrl.current_size);
	img.onload = function () {
		ctrl.current_size = (this.naturalWidth + 'x' + this.naturalHeight);
		console.log(ctrl.current_size);
		$scope.$apply();
	}

	ctrl.getEditPolicyData = function (id) {
		ctrl.title = "Edit Policy & Target";
		policyService.getEditPolicyByID(id).then(function (r) {
			ctrl.policyModel = {
				id: r.id,
				topic: r.topic,
				documentDate: parseISOStringToDateStr(r.documentDate),
				status: r.status,
				thumbnail: r.thumbnail !== null ? r.thumbnail : 'images/nopic.png',
				fileName: r.fileName,
				selectedCategory: null,
				selectedPermission: null,
				updatedDate: r.updatedDate,
				updatedBy: r.updatedBy,
				createdDate: r.createdDate,
				createdBy: r.createdBy
			};

			angular.forEach(ctrl.categories, function (value, key) {
				if (r.categoryID === value.id)
					ctrl.policyModel.selectedCategory = value;
			});
			angular.forEach(ctrl.permissions, function (value, key) {
				if (r.accessGroupID === value.id)
					ctrl.policyModel.selectedPermission = value;
			});
		}, function (err) {
			toastr.error(err.statusText, 'Error');
		});
	}

	// image cropper
	ctrl.deleteCoverImage = function () {
		ctrl.policyModel.thumbnail = 'images/nopic.png';
	}
	ctrl.uploadCoverImage = function () {

		var modalInstanceCtrl = ['$scope', '$uibModalInstance', function ($scope, $uibModalInstance) {

			$scope.myCroppedImage = '';
			$scope.myImage = '';

			$scope.triggerUpload = function () {
				var fileuploader = angular.element("#fileInput");
				fileuploader.on('click', function () { })
				fileuploader.on('change', handleFileSelect);
				fileuploader.trigger('click')
			}
			$scope.blockingObject = { block: true };
			$scope.cropFuntion = function () {
				$uibModalInstance.close($("#result-text").html());
			}
			$scope.blockingObject.callback = function (dataURL) {
				$uibModalInstance.close(dataURL);
			}
			var handleFileSelect = function (evt) {
				var file = evt.currentTarget.files[0];
				var reader = new FileReader();
				reader.onload = function (evt) {
					$scope.$apply(function ($scope) {
						$scope.myImage = evt.target.result;
					});
				};
				reader.readAsDataURL(file);

				setTimeout(function () {
					var img = document.getElementById("myCroppedImage");
					$scope.current_size = (img.naturalWidth + 'x' + img.naturalHeight);
					console.log($scope.current_size);
					$scope.$apply();
					img.onload = function () {
						$scope.current_size = (this.naturalWidth + 'x' + this.naturalHeight);
						console.log($scope.current_size);
						$scope.$apply();
					}
				}, 500)
			};

			$scope.close = function () {
				$uibModalInstance.close(null);
			}
		}];

		var modalInstance = $uibModal.open({
			animation: true,
			templateUrl: 'upload-cover.html',
			controller: modalInstanceCtrl,
			backdrop: 'static',
			size: ''
		});

		modalInstance.result.then(function (dataURL) {
			if (dataURL) {
				ctrl.policyModel.thumbnail = dataURL;
			}
		});
	}

	// upload pdf and docs file
	ctrl.file = null;
	ctrl.validateFile = function ($invalidFiles) {
		if ($invalidFiles && $invalidFiles[0] != null) {
			//console.log($invalidFiles);
			let errType = $invalidFiles[0].$error;
			if (errType === 'pattern') {
				toastr.error('Invalid file type. accepted for upload only (' + $invalidFiles[0].$errorParam + ')', 'Error', { timeOut: 6000 });
			}
			else if (errType === 'maxSize') {
				toastr.error('Exceeds the maximum file-size ( ' + $invalidFiles[0].$errorParam + ' ).', 'Error', { timeOut: 6000 });
			}
			else {
				toastr.error($invalidFiles[0].$error, 'Error', { timeOut: 6000 });
			}
		}
		else {
			if (ctrl.file != null) {
				ctrl.policyModel.fileName = ctrl.file.name;
			}
		}
	}
	ctrl.selectFile = function () {
	}
	ctrl.removeFile = function () {
		ctrl.policyModel.fileName = null;
		ctrl.file = null;
	}

	ctrl.submitPolicy = function (valid) {
		angular.forEach($scope.frmEdit.$$controls, function (field) {
			field.$setDirty();
			field.$validate();
		});
		if (valid) {
			var postObj = {
				id: ctrl.policyModel.id,
				status: ctrl.policyModel.status,
				topic: ctrl.policyModel.topic,
				categoryID: ctrl.policyModel.selectedCategory.id,
				accessGroupID: ctrl.policyModel.selectedPermission.id,
				documentDate: ctrl.policyModel.documentDate
			};

			var fd = new FormData();
			fd.append('ID', postObj.id);
			fd.append('Status', postObj.status);
			fd.append('topic', ctrl.policyModel.topic);
			fd.append('CategoryID', postObj.categoryID);
			fd.append('AccessGroupID', postObj.accessGroupID);
			fd.append('DocumentDatePost', postObj.documentDate);

			if (ctrl.policyModel.thumbnail !== 'images/nopic.png') {
				fd.append('Thumbnail', ctrl.policyModel.thumbnail);
			} else {
				fd.append('Thumbnail', null);
			}

			fd.append('fileName', ctrl.policyModel.fileName);

			if ((!ctrl.policyModel.fileName || ctrl.policyModel.fileName == null) && ctrl.file == null) {
				toastr.error("กรุณาอัพโหลดไฟล์แนบ.");
				return;
			}

			if (ctrl.policyModel.fileName != null && ctrl.file != null) {
				fd.append('file', ctrl.file);
			} else {
				fd.append('file', null);
			}

			// reset file browsing
			ctrl.file = null;
			ctrl.processing = true;
			$http.post(appSetting.apiBaseUrl + '/api/policy/savePolicy', fd, {
				transformRequest: angular.identity,
				headers: {
					'Content-Type': undefined
				}
			}).then(function (r) {
				toastr.success("บันทึกสำเร็จ");
				ctrl.processing = false;
				ctrl.getEditPolicyData(r.data.id);
			}, function (err) {
				ctrl.processing = false;
				toastr.error(err.statusText, 'Error');
			});
		}
	}
}

angular.module("app").controller("ContactCtrl", ['$scope'
	, '$http'
	, '$window'
	, 'toastr'
	, 'authService'
	, 'contactService'
	, '$state'
	, '$timeout'
	, '$uibModal', ContactCtrl]);
function ContactCtrl($scope, $http, $window, toastr, authService, contactService, $state, $timeout, $uibModal) {
	var ctrl = this;
	ctrl.pageSizes = [20, 50, 100, 200];
	ctrl.totalPage = 0;
	ctrl.criteria = {
		fullName: '',
		pageNumber: 1,
		pageSize: ctrl.pageSizes[0],
		total: 0,
		totalCounter: 0,
		sortingOrder: 'SubmitDate',
		reverse: true,
		results: []
	}

	ctrl.canView = false;
	ctrl.canEdit = false;
	ctrl.canView = authService.isGranted('view_contactlist');
	ctrl.canEdit = authService.isGranted('modify_contactlist');

	ctrl.goto = function (v, obj) {
		if (v === 'Dashboard') {
			$state.go('portal.dashboard');
		}
		else if (v === 'Contacts') {
			$state.go('portal.contact');
		}
		else if (v === 'ResponseContact') {
			$state.go('portal.contactresp', { obj: { mode: 'edit', data: obj } });

		}
	}

	// chang sorting order
	ctrl.sort_by = function (newSortingOrder) {
		if (ctrl.criteria.sortingOrder == newSortingOrder)
			ctrl.criteria.reverse = !ctrl.criteria.reverse;

		ctrl.criteria.sortingOrder = newSortingOrder;

		ctrl.searchContact(true);
	};

	ctrl.searchContact = function (isClickSearch) {
		$('#searchresult').block({
			message: loading,
			css: { border: '0px', backgroundColor: 'none', fontSize: '0.4em' }
		});
		if (isClickSearch) {
			ctrl.criteria.pageNumber = 1;
			ctrl.criteria.pageSize = ctrl.pageSizes[0];
		}
		contactService.searchContactList(ctrl.criteria).then(function (r) {
			$('#searchresult').unblock();
			ctrl.criteria.total = r.total;
			ctrl.criteria.results = r.contacts;
			ctrl.criteria.totalCounter = r.totalCounter;
			let x = Math.floor(r.total / ctrl.criteria.pageSize);
			if ((r.total % ctrl.criteria.pageSize) >= 1)
				x = x + 1;

			ctrl.totalPage = x;
			// set priority of each category group

		}, function (err) {
			$('#searchresult').unblock();
			toastr.error(err.statusText, 'Error');
		});
	}
	ctrl.clearSearch = function () {
		ctrl.criteria = {
			fullName: '',
			pageNumber: 1,
			pageSize: ctrl.pageSizes[0],
			total: 0,
			sortingOrder: 'SubmitDate',
			reverse: true,
			totalCounter: 0
		}
		ctrl.searchContact();
	}
	ctrl.previousPage = function () {
		if (ctrl.criteria.pageNumber > 1 && ctrl.totalPage > 1) {
			ctrl.criteria.pageNumber = ctrl.criteria.pageNumber - 1;
			ctrl.searchContact();
		}
	}
	ctrl.nextPage = function () {
		if (ctrl.criteria.pageNumber >= 1 && (ctrl.criteria.pageNumber < ctrl.totalPage)) {
			ctrl.criteria.pageNumber = ctrl.criteria.pageNumber + 1;
			ctrl.searchContact();
		}
	}
	ctrl.changePageSize = function () {
		ctrl.criteria.pageNumber = 1;
		ctrl.searchContact();
	}
	ctrl.showDelete = false;
	ctrl.toggleAll = function () {
		var toggleStatus = !ctrl.isAllSelected;
		if (toggleStatus) {
			ctrl.showDelete = true;
		} else {
			ctrl.showDelete = false;
		}
		angular.forEach(ctrl.criteria.results, function (itm) { itm.selected = toggleStatus; });
	}
	ctrl.optionToggled = function () {
		ctrl.isAllSelected = ctrl.criteria.results.every(function (itm) {
			return itm.selected;
		})
		let sel = false;
		angular.forEach(ctrl.criteria.results, function (value, key) {
			if (value.selected) {
				sel = true;
			}
		});
		if (sel)
			ctrl.showDelete = true;
		else
			ctrl.showDelete = false;
	}
	ctrl.deleteContacts = function () {

		var modalInstanceCtrl = ['$scope', '$uibModalInstance', function ($scope, $uibModalInstance) {
			$scope.submit = function () {
				$uibModalInstance.close(true);
			}
			$scope.close = function () {
				$uibModalInstance.close(false);
			}
		}];

		var modalInstance = $uibModal.open({
			animation: true,
			templateUrl: 'confirm-delete.html',
			controller: modalInstanceCtrl,
			backdrop: 'static',
			size: ''
		});

		modalInstance.result.then(function (confirmed) {
			if (confirmed) {
				let deletedIds = [];
				angular.forEach(ctrl.criteria.results, function (value, key) {
					if (value.selected) {
						deletedIds.push(value.id);
					}
				});
				if (deletedIds.length > 0) {
					ctrl.processing = true;
					contactService.deleteContacts(deletedIds).then(function (r) {
						ctrl.processing = false;
						toastr.success("ลบรายการสำเร็จ");
						ctrl.searchContact();
					}, function (err) {
						ctrl.processing = false;
						toastr.error(err.statusText, 'Error');
					});
				}
			}
		});
	}


	ctrl.searchContact();
}

angular.module("app").controller("ContactResponseCtrl", ['$scope'
	, '$http'
	, '$window'
	, 'toastr'
	, 'storageService'
	, 'contactService'
	, 'authService'
	, '$state'
	, '$timeout'
	, '$stateParams', ContactResponseCtrl]);
function ContactResponseCtrl($scope, $http, $window, toastr, storageService, contactService, authService, $state, $timeout, $stateParams) {
	var ctrl = this;
	ctrl.noteMaxLength = 1000;

	ctrl.contactModel = null;
	ctrl.processing = false;

	ctrl.stateModel = $stateParams.obj;
	if ($stateParams.obj !== null) {
		storageService.setData('responseModel', $stateParams.obj);
	}

	if (storageService.getData('responseModel') !== null && storageService.getData('responseModel') !== undefined) {
		ctrl.stateModel = storageService.getData('responseModel');
	}

	ctrl.canView = false;
	ctrl.canEdit = false;
	ctrl.canView = authService.isGranted('view_contactlist');
	ctrl.canEdit = authService.isGranted('modify_contactlist');

	ctrl.goto = function (sel, obj) {
		if (sel === 'Dashboard') {
			$state.go('portal.dashboard');
		} else if (sel === 'Contacts') {
			$state.go('portal.contact');
		}
	}

	ctrl.profile = null;
	ctrl.getContactData = function () {
		authService.getUserInfo().then(function (result) {
			ctrl.profile = result;
			contactService.getContactByID(ctrl.stateModel.data.id).then(function (r) {
				ctrl.contactModel = r;

				if (!ctrl.contactModel.responsedDate) {
					ctrl.contactModel.responsedDate = getCurrentDateStr();
				}
				else {
					ctrl.contactModel.responsedDate = parseISOStringToDateStr(ctrl.contactModel.responsedDate);
				}
				if (!ctrl.contactModel.responsedBy) {
					ctrl.contactModel.responsedBy = ctrl.profile.username;
				}
			}, function (err) {
				toastr.error(err.statusText, 'Error');
			});
		});
	}
	ctrl.getContactData();

	ctrl.saveResponseContact = function (valid) {
		angular.forEach($scope.frmEdit.$$controls, function (field) {
			field.$setDirty();
			field.$validate();
		});
		if (valid) {

			ctrl.processing = true;
			let postObj = {
				id: ctrl.contactModel.id,
				responsedBy: ctrl.contactModel.responsedBy,
				ResponsedDatePost: ctrl.contactModel.responsedDate,
				noted: ctrl.contactModel.noted
			}
			contactService.saveContactResponse(postObj).then(function (r) {
				toastr.success("บันทึกสำเร็จ");
				ctrl.processing = false;
				ctrl.getContactData();
			}, function (err) {
				ctrl.processing = false;
				toastr.error(err.statusText, 'Error');
			});
		}
	}
}

angular.module("app").controller("FAQsCtrl", ['$scope'
	, '$http'
	, '$window'
	, 'toastr'
	, 'authService'
	, 'faqsService'
	, '$state'
	, '$timeout'
	, '$uibModal', FAQsCtrl]);
function FAQsCtrl($scope, $http, $window, toastr, authService, faqsService, $state, $timeout, $uibModal) {
	var ctrl = this;

	ctrl.permissions = [];
	ctrl.status = ['All', 'Active', 'Inactive'];
	ctrl.pageSizes = [20, 50, 100, 200];
	ctrl.totalPage = 0;
	ctrl.priorities = [];
	ctrl.criteria = {
		question: '',
		selectedPermission: null,
		selectedStatus: ctrl.status[0],
		pageNumber: 1,
		pageSize: ctrl.pageSizes[0],
		total: 0,
		totalCounter: 0,
		sortingOrder: 'n.[Priority]',
		reverse: false,
		results: []
	}


	ctrl.canView = false;
	ctrl.canEdit = false;
	ctrl.canView = authService.isGranted('view_faqs');
	ctrl.canEdit = authService.isGranted('modify_faqs');

	ctrl.goto = function (sel, obj) {
		if (sel === 'Dashboard') {
			$state.go('portal.dashboard');
		} else if (sel === 'AllFAQs') {
			$state.go('portal.faqs');
		} else if (sel === 'AddFAQs') {
			$state.go('portal.editfaqs', { obj: { mode: 'add', data: null } });
		} else if (sel === 'EditFAQs') {
			$state.go('portal.editfaqs', { obj: { mode: 'edit', data: obj } });
		}
	}
	ctrl.updateStatus = function (r) {
		$('#searchresult').block({
			message: loading,
			css: { border: '0px', backgroundColor: 'none', fontSize: '0.4em' }
		});
		faqsService.updateStatus({
			id: r.id,
			status: r.status == 'Active'
		}).then(function (r) {
			toastr.success("บันทึกสำเร็จ");
			ctrl.search(true);
		}, function (err) {
			ctrl.processing = false;
			toastr.error(err.statusText, 'Error');
			$('#searchresult').unblock();
		});
		// console.log(r);

	}
	// chang sorting order
	ctrl.sort_by = function (newSortingOrder) {
		if (ctrl.criteria.sortingOrder == newSortingOrder)
			ctrl.criteria.reverse = !ctrl.criteria.reverse;

		ctrl.criteria.sortingOrder = newSortingOrder;

		ctrl.search(true);
	};

	ctrl.getFAQsSearchCriteria = function () {
		faqsService.getFAQSearchCriteria().then(function (r) {
			ctrl.permissions = r.permissions;
			ctrl.criteria.selectedPermission = ctrl.permissions[0];

			ctrl.search();
		}, function (err) {
			if (err.data)
				toastr.error(err.data.MessageDetail, 'Error');
			else
				toastr.error(err.Message, 'Error');
		});
	}

	ctrl.search = function (isClickSearch) {
		$('#searchresult').block({
			message: loading,
			css: { border: '0px', backgroundColor: 'none', fontSize: '0.4em' }
		});
		if (isClickSearch) {
			ctrl.criteria.pageNumber = 1;
			ctrl.criteria.pageSize = ctrl.pageSizes[0];
		}
		faqsService.searchFAQs(ctrl.criteria).then(function (r) {
			$('#searchresult').unblock();
			ctrl.criteria.total = r.total;
			ctrl.criteria.results = r.faQs;
			ctrl.criteria.totalCounter = r.totalCounter;
			let x = Math.floor(r.total / ctrl.criteria.pageSize);
			if ((r.total % ctrl.criteria.pageSize) >= 1)
				x = x + 1;

			ctrl.totalPage = x;

		}, function (err) {
			$('#searchresult').unblock();
			toastr.error(err.statusText, 'Error');
		});
	}

	ctrl.clearSearch = function () {
		ctrl.criteria = {
			question: '',
			selectedPermission: ctrl.permissions[0],
			selectedStatus: ctrl.status[0],
			pageNumber: 1,
			pageSize: ctrl.pageSizes[0],
			total: 0,
			sortingOrder: 'n.[Priority]',
			reverse: false,
			totalCounter: 0
		}
		ctrl.search();
	}
	ctrl.previousPage = function () {
		if (ctrl.criteria.pageNumber > 1 && ctrl.totalPage > 1) {
			ctrl.criteria.pageNumber = ctrl.criteria.pageNumber - 1;
			ctrl.search();
		}
	}
	ctrl.nextPage = function () {
		if (ctrl.criteria.pageNumber >= 1 && (ctrl.criteria.pageNumber < ctrl.totalPage)) {
			ctrl.criteria.pageNumber = ctrl.criteria.pageNumber + 1;
			ctrl.search();
		}
	}
	ctrl.changePageSize = function () {
		ctrl.criteria.pageNumber = 1;
		ctrl.search();
	}
	ctrl.updatePriority = function (id, priority) {
		faqsService.updateFAQPriority(id, priority).then(function (r) {
			ctrl.search();
			toastr.success("บันทึกสำเร็จ");
		}, function (err) {
			toastr.error(err.statusText, 'Error');
		});
	}
	ctrl.showDelete = false;
	ctrl.toggleAll = function () {
		var toggleStatus = !ctrl.isAllSelected;
		if (toggleStatus) {
			ctrl.showDelete = true;
		} else {
			ctrl.showDelete = false;
		}
		angular.forEach(ctrl.criteria.results, function (itm) { itm.selected = toggleStatus; });
	}
	ctrl.optionToggled = function () {
		ctrl.isAllSelected = ctrl.criteria.results.every(function (itm) {
			return itm.selected;
		})
		let sel = false;
		angular.forEach(ctrl.criteria.results, function (value, key) {
			if (value.selected) {
				sel = true;
			}
		});
		if (sel)
			ctrl.showDelete = true;
		else
			ctrl.showDelete = false;
	}
	ctrl.deleteFAQs = function () {

		var modalInstanceCtrl = ['$scope', '$uibModalInstance', function ($scope, $uibModalInstance) {
			$scope.submit = function () {
				$uibModalInstance.close(true);
			}
			$scope.close = function () {
				$uibModalInstance.close(false);
			}
		}];

		var modalInstance = $uibModal.open({
			animation: true,
			templateUrl: 'confirm-delete.html',
			controller: modalInstanceCtrl,
			backdrop: 'static',
			size: ''
		});

		modalInstance.result.then(function (confirmed) {
			if (confirmed) {
				let deletedIds = [];
				angular.forEach(ctrl.criteria.results, function (value, key) {
					if (value.selected) {
						deletedIds.push(value.id);
					}
				});
				if (deletedIds.length > 0) {
					ctrl.processing = true;
					faqsService.deleteFAQs(deletedIds).then(function (r) {
						ctrl.processing = false;
						toastr.success("ลบรายการสำเร็จ");
						ctrl.search();
					}, function (err) {
						ctrl.processing = false;
						toastr.error(err.statusText, 'Error');
					});
				}
			}
		});

	}

	// init data
	ctrl.getFAQsSearchCriteria();

}

angular.module("app").controller("EditFAQsCtrl", ['$scope', '$http', '$window', 'toastr', 'authService', 'faqsService', '$state', '$stateParams', 'storageService', '$timeout', '$uibModal', 'Upload', 'appSetting', EditFAQsCtrl]);
function EditFAQsCtrl($scope, $http, $window, toastr, authService, faqsService, $state, $stateParams, storageService, $timeout, $uibModal, Upload, appSetting) {
	var ctrl = this;
	ctrl.questionMaxLength = 200;
	ctrl.answerMaxLength = 1000;
	ctrl.title = "Add FAQs";
	ctrl.faqsModel = null;
	ctrl.processing = false;

	ctrl.stateModel = $stateParams.obj;
	if ($stateParams.obj !== null) {
		storageService.setData('faqsModel', $stateParams.obj);
	}

	if (storageService.getData('faqsModel') !== null && storageService.getData('faqsModel') !== undefined) {
		ctrl.stateModel = storageService.getData('faqsModel');
	}

	ctrl.canView = false;
	ctrl.canEdit = false;
	ctrl.canView = authService.isGranted('view_faqs');
	ctrl.canEdit = authService.isGranted('modify_faqs');

	ctrl.goto = function (sel, obj) {
		if (sel === 'Dashboard') {
			$state.go('portal.dashboard');
		} else if (sel === 'AllFAQs') {
			$state.go('portal.faqs');
		}
	}

	// load master
	faqsService.getFAQMaster().then(function (r) {
		ctrl.permissions = r.permissions;

		// switch binding
		if (ctrl.stateModel.mode === 'add') {
			ctrl.title = "Add FAQs";
			ctrl.faqsModel = {
				id: 0,
				question: null,
				answer: null,
				status: true,
				selectedPermission: ctrl.permissions[0]
			};
		}
		else if (ctrl.stateModel.mode === 'edit') {
			ctrl.title = "Edit FAQs";
			let id = ctrl.stateModel.data.id;
			ctrl.getEditFAQsData(id)
		}
	}, function (err) {
		toastr.error(err.statusText, 'Error');
	});

	ctrl.getEditFAQsData = function (id) {
		ctrl.title = "Edit FAQs";
		faqsService.getEditFAQByID(id).then(function (r) {

			ctrl.faqsModel = {
				id: r.id,
				question: r.question,
				answer: r.answer,
				status: r.status,
				selectedPermission: null,
				updatedDate: r.updatedDate,
				updatedBy: r.updatedBy,
				createdDate: r.createdDate,
				createdBy: r.createdBy
			};

			angular.forEach(ctrl.permissions, function (value, key) {
				if (r.accessGroupID === value.id)
					ctrl.faqsModel.selectedPermission = value;
			});
		}, function (err) {
			toastr.error(err.statusText, 'Error');
		});
	}

	ctrl.submit = function (valid) {
		angular.forEach($scope.frmEdit.$$controls, function (field) {
			field.$setDirty();
			field.$validate();
		});
		if (valid) {
			ctrl.processing = true;
			let postObj = {
				id: ctrl.faqsModel.id,
				question: ctrl.faqsModel.question,
				answer: ctrl.faqsModel.answer,
				status: ctrl.faqsModel.status,
				AccessGroupID: ctrl.faqsModel.selectedPermission.id,
			}
			faqsService.saveFAQs(postObj).then(function (r) {
				toastr.success("บันทึกสำเร็จ");
				ctrl.processing = false;
				ctrl.getEditFAQsData(r.id);
			}, function (err) {
				ctrl.processing = false;
				toastr.error(err.statusText, 'Error');
			});
		}
	}
}

angular.module("app").controller("PreviewCtrl", ['$scope', '$sce', '$stateParams', 'toastr', 'authService', 'previewService', 'aboutService', PreviewCtrl]);
function PreviewCtrl($scope, $sce, $stateParams, toastr, authService, previewService, aboutService) {
	ctrl = this;
	$scope.$sce = $sce;
	ctrl.displayLayout = null;
	ctrl.model = null;

	//console.log('$location', $stateParams.p);
	ctrl.mode = $stateParams.m;
	ctrl.loadNewsContent = function (id) {
		ctrl.loading = true;
		previewService.getNewsById(id).then(function (r) {
			ctrl.model = r;
			ctrl.displayLayout = ctrl.model.displayLayout;

			if (ctrl.displayLayout == "LAYOUT_ANNOUNCEMENT") {
				setTimeout(function () {
					initPreviewAnnouncement()
				}, 200);
			}
			else if (ctrl.displayLayout == "LAYOUT_ACTIVITY") {
				setTimeout(function () {
					initPreviewActivity();
				}, 200);
			}
			else if (ctrl.displayLayout == "LAYOUT_AWARD") {
				setTimeout(function () {
					initPreviewAward();
				}, 200);
			}
			else {
				ctrl.displayLayout == "NOTSUPPORT";
			}

			ctrl.loading = false;
			//console.log(ctrl.model);
		}, function (err) {
			ctrl.loading = false;
			toastr.error(err.statusText, 'Error');
		});
	}
	ctrl.loadAboutContent = function (id) {
		aboutService.getAboutContent(id).then(function (r) {
			ctrl.model = r;
			ctrl.displayLayout = "LAYOUT_ABOUT";

			ctrl.loading = false;
		}, function (err) {
			ctrl.loading = false;
			toastr.error(err.statusText, 'Error');
		});
	}

	// select view mode
	if (ctrl.mode == "news") {
		ctrl.loadNewsContent($stateParams.p);
	}
	else if (ctrl.mode == "about") {
		ctrl.loadAboutContent($stateParams.p);
	}

}

angular.module("app").controller("UserGroupCtrl", ['$scope'
	, '$http'
	, '$window'
	, 'toastr'
	, '$timeout'
	, '$state'
	, 'userService'
	, 'authService'
	, 'appSetting'
	, '$uibModal', UserGroupCtrl]);
function UserGroupCtrl($scope
	, $http
	, $window
	, toastr
	, $timeout
	, $state
	, userService
	, authService
	, appSetting
	, $uibModal) {

	var ctrl = this;

	ctrl.pageSizes = [20, 50, 100, 200];
	ctrl.totalPage = 0;
	ctrl.criteria = {
		groupName: '',
		pageNumber: 1,
		pageSize: ctrl.pageSizes[0],
		total: 0,
		sortingOrder: 'n.GroupName',
		reverse: false,
		results: []
	}

	ctrl.goto = function (sel, obj) {
		if (sel === 'Dashboard') {
			$state.go('portal.dashboard');
		} else if (sel === 'AddGroup') {
			$state.go('portal.editgroup', { obj: { mode: 'add', data: null } });
		} else if (sel === 'EditGroup') {
			$state.go('portal.editgroup', { obj: { mode: 'edit', data: obj } });
		}
	}

	ctrl.canView = false;
	ctrl.canEdit = false;
	ctrl.canView = authService.isGranted('view_usergroup');
	ctrl.canEdit = authService.isGranted('modify_usergroup');

	// chang sorting order
	ctrl.sort_by = function (newSortingOrder) {
		if (ctrl.criteria.sortingOrder == newSortingOrder)
			ctrl.criteria.reverse = !ctrl.criteria.reverse;

		ctrl.criteria.sortingOrder = newSortingOrder;

		ctrl.search(true);
	};
	ctrl.updateStatus = function (r) {
		$('#searchresult').block({
			message: loading,
			css: { border: '0px', backgroundColor: 'none', fontSize: '0.4em' }
		});
		userService.updateStatus({
			id: r.id,
			status: r.status
		}).then(function (r) {
			toastr.success("บันทึกสำเร็จ");
			ctrl.search(true);
		}, function (err) {
			ctrl.processing = false;
			toastr.error(err.statusText, 'Error');
			$('#searchresult').unblock();
		});
		// console.log(r);

	}
	ctrl.search = function (isClickSearch) {
		$('#searchresult').block({
			message: loading,
			css: { border: '0px', backgroundColor: 'none', fontSize: '0.4em' }
		});
		if (isClickSearch) {
			ctrl.criteria.pageNumber = 1;
			ctrl.criteria.pageSize = ctrl.pageSizes[0];
		}
		userService.searchUserGroup(ctrl.criteria).then(function (r) {
			$('#searchresult').unblock();
			ctrl.criteria.total = r.total;
			ctrl.criteria.results = r.groups;
			let x = Math.floor(r.total / ctrl.criteria.pageSize);
			if ((r.total % ctrl.criteria.pageSize) >= 1)
				x = x + 1;

			ctrl.totalPage = x;
			// set priority of each category group

		}, function (err) {
			$('#searchresult').unblock();
			toastr.error(err.statusText, 'Error');
		});
	}
	ctrl.clearSearch = function () {
		ctrl.criteria = {
			groupName: '',
			pageNumber: 1,
			pageSize: ctrl.pageSizes[0],
			sortingOrder: 'n.GroupName',
			reverse: false,
			total: 0
		}
		ctrl.search();
	}
	ctrl.previousPage = function () {
		if (ctrl.criteria.pageNumber > 1 && ctrl.totalPage > 1) {
			ctrl.criteria.pageNumber = ctrl.criteria.pageNumber - 1;
			ctrl.search();
		}
	}
	ctrl.nextPage = function () {
		if (ctrl.criteria.pageNumber >= 1 && (ctrl.criteria.pageNumber < ctrl.totalPage)) {
			ctrl.criteria.pageNumber = ctrl.criteria.pageNumber + 1;
			ctrl.search();
		}
	}
	ctrl.changePageSize = function () {
		ctrl.criteria.pageNumber = 1;
		ctrl.search();
	}
	ctrl.showDelete = false;
	ctrl.toggleAll = function () {
		var toggleStatus = !ctrl.isAllSelected;
		if (toggleStatus) {
			ctrl.showDelete = true;
		} else {
			ctrl.showDelete = false;
		}
		angular.forEach(ctrl.criteria.results, function (itm) { itm.selected = toggleStatus; });
	}
	ctrl.optionToggled = function () {
		ctrl.isAllSelected = ctrl.criteria.results.every(function (itm) {
			return itm.selected;
		})
		let sel = false;
		angular.forEach(ctrl.criteria.results, function (value, key) {
			if (value.selected) {
				sel = true;
			}
		});
		if (sel)
			ctrl.showDelete = true;
		else
			ctrl.showDelete = false;
	}
	ctrl.delete = function () {

		var modalInstanceCtrl = ['$scope', '$uibModalInstance', function ($scope, $uibModalInstance) {
			$scope.submit = function () {
				$uibModalInstance.close(true);
			}
			$scope.close = function () {
				$uibModalInstance.close(false);
			}
		}];

		var modalInstance = $uibModal.open({
			animation: true,
			templateUrl: 'confirm-delete.html',
			controller: modalInstanceCtrl,
			backdrop: 'static',
			size: ''
		});

		modalInstance.result.then(function (confirmed) {
			if (confirmed) {
				let deletedIds = [];
				angular.forEach(ctrl.criteria.results, function (value, key) {
					if (value.selected) {
						deletedIds.push(value.id);
					}
				});
				if (deletedIds.length > 0) {
					ctrl.processing = true;
					userService.deleteUserGroups(deletedIds).then(function (r) {
						ctrl.processing = false;
						toastr.success("ลบรายการสำเร็จ");

						// reset toggle
						ctrl.isAllSelected = false;
						ctrl.showDelete = false;

						ctrl.search();
					}, function (err) {
						ctrl.processing = false;
						toastr.error(err.statusText, 'Error');
					});
				}
			}
		});
	}

	ctrl.search();
}

angular.module("app").controller("EditGroupCtrl", ['$scope'
	, '$http'
	, '$window'
	, 'toastr'
	, '$timeout'
	, '$state'
	, '$stateParams'
	, 'userService'
	, 'authService'
	, 'storageService'
	, 'appSetting'
	, '$uibModal', EditGroupCtrl]);
function EditGroupCtrl($scope
	, $http
	, $window
	, toastr
	, $timeout
	, $state
	, $stateParams
	, userService
	, authService
	, storageService
	, appSetting
	, $uibModal) {

	var ctrl = this;
	ctrl.groupNameMaxLength = 255;
	ctrl.title = "Add";
	ctrl.model = {
		id: 0,
		groupName: null,
		status: 'Active',
		view_about: 'N',
		modify_about: 'N',
		view_category_applications: 'N',
		modify_category_applications: 'N',
		view_applications: 'N',
		modify_applications: 'N',
		view_category_news: 'N',
		modify_category_news: 'N',
		view_news: 'N',
		modify_news: 'N',
		view_category_policy: 'N',
		modify_category_policy: 'N',
		view_policy: 'N',
		modify_policy: 'N',
		view_category_download: 'N',
		modify_category_download: 'N',
		view_download: 'N',
		modify_download: 'N',
		view_contactlist: 'N',
		modify_contactlist: 'N',
		view_faqs: 'N',
		modify_faqs: 'N',
		view_usergroup: 'N',
		modify_usergroup: 'N',
		view_adminuser: 'N',
		modify_adminuser: 'N',
		view_frontenduser: 'N',
		modify_frontenduser: 'N',

		view_activity_log: 'N',
		modify_activity_log: 'N',
		view_usage_log: 'N',
		modify_usage_log: 'N',

		view_category_dashboard: 'N',
		modify_category_dashboard: 'N',
		view_dashboard_config: 'N',
		modify_dashboard_config: 'N',
		view_monitor_tableau: 'N',
		view_monitor_email: 'N',
		view_corperate: 'N',
		modify_corperate: 'N',
		view_google_analytics: 'N'
	};
	ctrl.statuss = ['Active', 'Inactive'];

	ctrl.stateModel = $stateParams.obj;
	if ($stateParams.obj !== null) {
		storageService.setData('groupModel', $stateParams.obj);
	}

	if (storageService.getData('groupModel') !== null && storageService.getData('groupModel') !== undefined) {
		ctrl.stateModel = storageService.getData('groupModel');
	}

	ctrl.goto = function (v) {
		if (v === 'dashboard') {
			$state.go('portal.dashboard');
		} else if (v === 'groups') {
			$state.go('portal.groups');
		}
	}

	ctrl.canView = false;
	ctrl.canEdit = false;
	ctrl.canView = authService.isGranted('view_usergroup');
	ctrl.canEdit = authService.isGranted('modify_usergroup');

	// switch binding
	ctrl.stateChecking = function () {
		if (ctrl.stateModel.mode === 'add') {
			ctrl.title = "Add";
		}
		else if (ctrl.stateModel.mode === 'edit') {
			ctrl.title = "Edit";
			let id = ctrl.stateModel.data.id;
			ctrl.getEditGroupData(id)
		}
	}
	ctrl.getEditGroupData = function (id) {
		ctrl.title = "Edit";
		userService.getEditGroupById(id).then(function (r) {
			ctrl.model = {
				id: r.id,
				groupName: r.groupName,
				status: r.status,
				view_about: r.view_about,
				modify_about: r.modify_about,
				view_category_applications: r.view_category_applications,
				modify_category_applications: r.modify_category_applications,
				view_applications: r.view_applications,
				modify_applications: r.modify_applications,
				view_category_news: r.view_category_news,
				modify_category_news: r.modify_category_news,
				view_news: r.view_news,
				modify_news: r.modify_news,
				view_category_policy: r.view_category_policy,
				modify_category_policy: r.modify_category_policy,
				view_policy: r.view_policy,
				modify_policy: r.modify_policy,
				view_category_download: r.view_category_download,
				modify_category_download: r.modify_category_download,
				view_download: r.view_download,
				modify_download: r.modify_download,
				view_contactlist: r.view_contactlist,
				modify_contactlist: r.modify_contactlist,
				view_faqs: r.view_faqs,
				modify_faqs: r.modify_faqs,
				view_usergroup: r.view_usergroup,
				modify_usergroup: r.modify_usergroup,
				view_adminuser: r.view_adminuser,
				modify_adminuser: r.modify_adminuser,
				view_frontenduser: r.view_frontenduser,
				modify_frontenduser: r.modify_frontenduser,

				view_activity_log: r.view_activity_log,
				modify_activity_log: r.modify_activity_log,
				view_usage_log: r.view_usage_log,
				modify_usage_log: r.modify_usage_log,

				view_category_dashboard: r.view_category_dashboard,
				modify_category_dashboard: r.modify_category_dashboard,
				view_dashboard_config: r.view_dashboard_config,
				modify_dashboard_config: r.modify_dashboard_config,
				view_monitor_tableau: r.view_monitor_tableau,
				view_monitor_email: r.view_monitor_email,
				view_corperate: r.view_corperate,
				modify_corperate: r.modify_corperate,
				view_google_analytics: r.view_google_analytics,

				updatedDate: r.updatedDate,
				updatedBy: r.updatedBy,
				createdDate: r.createdDate,
				createdBy: r.createdBy
			};
		}, function (err) {
			toastr.error(err.statusText, 'Error');
		});
	}

	ctrl.submit = function (valid) {
		angular.forEach($scope.frmEdit.$$controls, function (field) {
			field.$setDirty();
			field.$validate();
		});
		if (valid) {
			ctrl.processing = true;
			let postObj = {
				id: ctrl.model.id,
				groupName: ctrl.model.groupName,
				status: ctrl.model.status,
				view_about: ctrl.model.view_about,
				modify_about: ctrl.model.modify_about,
				view_category_applications: ctrl.model.view_category_applications,
				modify_category_applications: ctrl.model.modify_category_applications,
				view_applications: ctrl.model.view_applications,
				modify_applications: ctrl.model.modify_applications,
				view_category_news: ctrl.model.view_category_news,
				modify_category_news: ctrl.model.modify_category_news,
				view_news: ctrl.model.view_news,
				modify_news: ctrl.model.modify_news,
				view_category_policy: ctrl.model.view_category_policy,
				modify_category_policy: ctrl.model.modify_category_policy,
				view_policy: ctrl.model.view_policy,
				modify_policy: ctrl.model.modify_policy,
				view_category_download: ctrl.model.view_category_download,
				modify_category_download: ctrl.model.modify_category_download,
				view_download: ctrl.model.view_download,
				modify_download: ctrl.model.modify_download,
				view_contactlist: ctrl.model.view_contactlist,
				modify_contactlist: ctrl.model.modify_contactlist,
				view_faqs: ctrl.model.view_faqs,
				modify_faqs: ctrl.model.modify_faqs,
				view_usergroup: ctrl.model.view_usergroup,
				modify_usergroup: ctrl.model.modify_usergroup,
				view_adminuser: ctrl.model.view_adminuser,
				modify_adminuser: ctrl.model.modify_adminuser,
				view_frontenduser: ctrl.model.view_frontenduser,
				modify_frontenduser: ctrl.model.modify_frontenduser,

				view_category_dashboard: ctrl.model.view_category_dashboard,
				modify_category_dashboard: ctrl.model.modify_category_dashboard,
				view_dashboard_config: ctrl.model.view_dashboard_config,
				modify_dashboard_config: ctrl.model.modify_dashboard_config,
				view_monitor_tableau: ctrl.model.view_monitor_tableau,
				view_monitor_email: ctrl.model.view_monitor_email,
				view_corperate: ctrl.model.view_corperate,
				modify_corperate: ctrl.model.modify_corperate,
				view_google_analytics: ctrl.model.view_google_analytics,

				view_activity_log: ctrl.model.view_activity_log,
				modify_activity_log: ctrl.model.modify_activity_log,
				view_usage_log: ctrl.model.view_usage_log,
				modify_usage_log: ctrl.model.modify_usage_log,
			}
			userService.saveGroup(postObj).then(function (r) {
				toastr.success("บันทึกสำเร็จ");
				ctrl.processing = false;
				ctrl.getEditGroupData(r.id);
			}, function (err) {
				ctrl.processing = false;
				toastr.error(err.statusText, 'Error');
			});
		}
		//
	}
	ctrl.stateChecking();
}

angular.module("app").controller("AdminUserCtrl", ['$scope'
	, '$http'
	, '$window'
	, 'toastr'
	, '$timeout'
	, '$state'
	, 'userService'
	, 'authService'
	, 'appSetting'
	, '$uibModal', AdminUserCtrl]);
function AdminUserCtrl($scope
	, $http
	, $window
	, toastr
	, $timeout
	, $state
	, userService
	, authService
	, appSetting
	, $uibModal) {

	var ctrl = this;
	ctrl.status = ['Active', 'Inactive'];
	ctrl.pageSizes = [20, 50, 100, 200];
	ctrl.totalPage = 0;
	ctrl.criteria = {
		username: '',
		fullName: '',
		pageNumber: 1,
		pageSize: ctrl.pageSizes[0],
		total: 0,
		sortingOrder: 'u.FirstName',
		reverse: false,
		results: []
	}

	ctrl.goto = function (sel, obj) {
		if (sel === 'Dashboard') {
			$state.go('portal.dashboard');
		} else if (sel === 'AddAdminuser') {
			$state.go('portal.addaduser');
		} else if (sel === 'EditAdminUser') {
			$state.go('portal.editaduser', { obj: { mode: 'edit', data: obj } });
		}
	}

	ctrl.canView = false;
	ctrl.canEdit = false;
	ctrl.canView = authService.isGranted('view_adminuser');
	ctrl.canEdit = authService.isGranted('modify_adminuser');

	// chang sorting order
	ctrl.sort_by = function (newSortingOrder) {
		if (ctrl.criteria.sortingOrder == newSortingOrder)
			ctrl.criteria.reverse = !ctrl.criteria.reverse;

		ctrl.criteria.sortingOrder = newSortingOrder;

		ctrl.search(true);
	};

	ctrl.search = function (isClickSearch) {
		$('#searchresult').block({
			message: loading,
			css: { border: '0px', backgroundColor: 'none', fontSize: '0.4em' }
		});
		if (isClickSearch) {
			ctrl.criteria.pageNumber = 1;
			ctrl.criteria.pageSize = ctrl.pageSizes[0];
		}
		userService.searchAdminUser(ctrl.criteria).then(function (r) {
			$('#searchresult').unblock();
			ctrl.criteria.total = r.total;
			ctrl.criteria.results = r.adminUsers;
			let x = Math.floor(r.total / ctrl.criteria.pageSize);
			if ((r.total % ctrl.criteria.pageSize) >= 1)
				x = x + 1;

			ctrl.totalPage = x;
			// set priority of each category group

		}, function (err) {
			$('#searchresult').unblock();
			toastr.error(err.statusText, 'Error');
		});
	}
	ctrl.clearSearch = function () {
		ctrl.criteria = {
			username: '',
			fullName: '',
			pageNumber: 1,
			pageSize: ctrl.pageSizes[0],
			sortingOrder: 'u.FirstName',
			reverse: false,
			total: 0
		}
		ctrl.search();
	}
	ctrl.previousPage = function () {
		if (ctrl.criteria.pageNumber > 1 && ctrl.totalPage > 1) {
			ctrl.criteria.pageNumber = ctrl.criteria.pageNumber - 1;
			ctrl.search();
		}
	}
	ctrl.nextPage = function () {
		if (ctrl.criteria.pageNumber >= 1 && (ctrl.criteria.pageNumber < ctrl.totalPage)) {
			ctrl.criteria.pageNumber = ctrl.criteria.pageNumber + 1;
			ctrl.search();
		}
	}
	ctrl.changePageSize = function () {
		ctrl.criteria.pageNumber = 1;
		ctrl.search();
	}
	ctrl.showDelete = false;
	ctrl.toggleAll = function () {
		var toggleStatus = !ctrl.isAllSelected;
		if (toggleStatus) {
			ctrl.showDelete = true;
		} else {
			ctrl.showDelete = false;
		}
		angular.forEach(ctrl.criteria.results, function (itm) { itm.selected = toggleStatus; });
	}
	ctrl.optionToggled = function () {
		ctrl.isAllSelected = ctrl.criteria.results.every(function (itm) {
			return itm.selected;
		})
		let sel = false;
		angular.forEach(ctrl.criteria.results, function (value, key) {
			if (value.selected) {
				sel = true;
			}
		});
		if (sel)
			ctrl.showDelete = true;
		else
			ctrl.showDelete = false;
	}
	ctrl.delete = function () {

		var modalInstanceCtrl = ['$scope', '$uibModalInstance', function ($scope, $uibModalInstance) {
			$scope.submit = function () {
				$uibModalInstance.close(true);
			}
			$scope.close = function () {
				$uibModalInstance.close(false);
			}
		}];

		var modalInstance = $uibModal.open({
			animation: true,
			templateUrl: 'confirm-delete.html',
			controller: modalInstanceCtrl,
			backdrop: 'static',
			size: ''
		});

		modalInstance.result.then(function (confirmed) {
			if (confirmed) {
				let deletedIds = [];
				angular.forEach(ctrl.criteria.results, function (value, key) {
					if (value.selected) {
						deletedIds.push(value.id);
					}
				});
				if (deletedIds.length > 0) {
					ctrl.processing = true;
					userService.deleteAdminUsers(deletedIds).then(function (r) {
						ctrl.processing = false;
						toastr.success("ลบรายการสำเร็จ");

						// reset toggle
						ctrl.isAllSelected = false;
						ctrl.showDelete = false;

						ctrl.search();
					}, function (err) {
						ctrl.processing = false;
						toastr.error(err.statusText, 'Error');
					});
				}
			}
		});
	}
	ctrl.updateAdminUserStatus = function (obj) {
		userService.updateAdminUserStatus(obj.id, obj.status).then(function (r) {
			toastr.success("บันทึกสำเร็จ");
			ctrl.search();
		}, function (err) {
			toastr.error(err.statusText, 'Error');
		});
	}

	ctrl.search();
}
angular.module("app").controller("CorperateList", ['$scope'
	, '$http'
	, '$window'
	, 'toastr'
	, '$timeout'
	, '$state'
	, 'corperateService'
	, 'authService'
	, 'appSetting'
	, '$uibModal', CorperateList]);
function CorperateList($scope
	, $http
	, $window
	, toastr
	, $timeout
	, $state
	, corperateService
	, authService
	, appSetting
	, $uibModal) {

	var ctrl = this;
	ctrl.status = ['Active', 'Inactive'];
	ctrl.pageSizes = [20, 50, 100, 200];
	ctrl.totalPage = 0;
	ctrl.criteria = {
		Code: '',
		FNAME: '',
		pageNumber: 1,
		pageSize: ctrl.pageSizes[0],
		total: 0,
		sortingOrder: "FNAME",
		reverse: "asc",
		results: []
	}

	ctrl.goto = function (sel, obj) {
		if (sel === 'AddCorperate') {
			$state.go('portal.addCorperate');
		} else if (sel === 'AddAdminuser') {
			$state.go('portal.addaduser');
		} else if (sel === 'EditCorperate') {
			console.log(obj);
			$state.go('portal.editcorperate', { obj: { mode: 'edit', data: obj } });
		}
	}

	ctrl.canView = false;
	ctrl.canEdit = false;
	ctrl.canView = authService.isGranted('view_corperate');
	ctrl.canEdit = authService.isGranted('modify_corperate');

	// chang sorting order
	ctrl.sort_by = function (newSortingOrder) {
		if (ctrl.criteria.sortingOrder == newSortingOrder)
			ctrl.criteria.reverse = ctrl.criteria.reverse == 'asc' ? 'desc' : 'asc';

		ctrl.criteria.sortingOrder = newSortingOrder;

		ctrl.search(true);
	};
	ctrl.updatestatus = function (body) {
		var fd = new FormData();
		// ctrl.editObj.Tableau_Workbook_Name=ctrl.editObj.Tableau_Workbook_ID;
		if (body.code != "" && body.code != undefined && body.code != null) {
			fd.append("Code", body.code);
		} else {
			fd.append("Code", "");
		}
		fd.append("FNAME", body.fname);
		fd.append("LNAME", body.lname);
		fd.append("unitabbr", body.unitabbr);
		fd.append("EmailAddr", body.emailAddr);
		fd.append("id", body.id);
		fd.append("Active", body.status == "Active");
		fd.append("CorperateType", body.corperateType);
		$http.post(appSetting.apiBaseUrl + '/api/corperate/saveCorperate', fd, {
			transformRequest: angular.identity,
			headers: {
				'Content-Type': undefined
			}
		}).then(function (r) {
			toastr.success("บันทึกสำเร็จ");
			ctrl.search();

		}, function (err) {

			toastr.error(err.statusText, 'Error');
		});
	}
	ctrl.search = function (isClickSearch) {
		$('#searchresult').block({
			message: loading,
			css: { border: '0px', backgroundColor: 'none', fontSize: '0.4em' }
		});
		if (isClickSearch) {
			ctrl.criteria.pageNumber = 1;
			ctrl.criteria.pageSize = ctrl.pageSizes[0];
		}
		corperateService.searchCorperate(ctrl.criteria).then(function (r) {
			$('#searchresult').unblock();
			ctrl.criteria.total = r.total;
			ctrl.criteria.results = r.corperates.map(function (item) {
				item.status = item.active ? "Active" : "Inactive";
				return item;
			});
			let x = Math.floor(r.total / ctrl.criteria.pageSize);
			if ((r.total % ctrl.criteria.pageSize) >= 1)
				x = x + 1;

			ctrl.totalPage = x;
			// set priority of each category group

		}, function (err) {
			$('#searchresult').unblock();
			toastr.error(err.statusText, 'Error');
		});
	}
	ctrl.clearSearch = function () {
		ctrl.criteria = {
			Code: '',
			FNAME: '',
			pageNumber: 1,
			pageSize: ctrl.pageSizes[0],
			total: 0,
			sortingOrder: "FNAME",
			reverse: "asc",
			results: []
		}

		ctrl.search();
	}
	ctrl.previousPage = function () {
		if (ctrl.criteria.pageNumber > 1 && ctrl.totalPage > 1) {
			ctrl.criteria.pageNumber = ctrl.criteria.pageNumber - 1;
			ctrl.search();
		}
	}
	ctrl.nextPage = function () {
		if (ctrl.criteria.pageNumber >= 1 && (ctrl.criteria.pageNumber < ctrl.totalPage)) {
			ctrl.criteria.pageNumber = ctrl.criteria.pageNumber + 1;
			ctrl.search();
		}
	}
	ctrl.changePageSize = function () {
		ctrl.criteria.pageNumber = 1;
		ctrl.search();
	}
	ctrl.showDelete = false;
	ctrl.toggleAll = function () {
		var toggleStatus = !ctrl.isAllSelected;
		if (toggleStatus) {
			ctrl.showDelete = true;
		} else {
			ctrl.showDelete = false;
		}
		angular.forEach(ctrl.criteria.results, function (itm) { itm.selected = toggleStatus; });
	}
	ctrl.optionToggled = function () {
		ctrl.isAllSelected = ctrl.criteria.results.every(function (itm) {
			return itm.selected;
		})
		let sel = false;
		angular.forEach(ctrl.criteria.results, function (value, key) {
			if (value.selected) {
				sel = true;
			}
		});
		if (sel)
			ctrl.showDelete = true;
		else
			ctrl.showDelete = false;
	}
	ctrl.delete = function () {
		console.log("deleting");
		var modalInstanceCtrl = ['$scope', '$uibModalInstance', function ($scope, $uibModalInstance) {
			$scope.submit = function () {
				$uibModalInstance.close(true);
			}
			$scope.close = function () {
				$uibModalInstance.close(false);
			}
		}];

		var modalInstance = $uibModal.open({
			animation: true,
			templateUrl: 'confirm-delete.html',
			controller: modalInstanceCtrl,
			backdrop: 'static',
			size: ''
		});

		modalInstance.result.then(function (confirmed) {
			if (confirmed) {
				let deletedIds = [];
				angular.forEach(ctrl.criteria.results, function (value, key) {
					if (value.selected) {
						deletedIds.push(value.id);
					}
				});
				if (deletedIds.length > 0) {
					ctrl.processing = true;
					corperateService.deleteCorperate(deletedIds).then(function (r) {
						ctrl.processing = false;
						toastr.success("ลบรายการสำเร็จ");

						// reset toggle
						ctrl.isAllSelected = false;
						ctrl.showDelete = false;

						ctrl.search();
					}, function (err) {
						ctrl.processing = false;
						toastr.error(err.statusText, 'Error');
					});
				}
			}
		});
	}
	ctrl.updateCorperate = function (obj) {
		corperateService.updateCorperate(obj.id, obj.status).then(function (r) {
			toastr.success("บันทึกสำเร็จ");
			ctrl.search();
		}, function (err) {
			toastr.error(err.statusText, 'Error');
		});
	}

	ctrl.search();
}

angular.module("app").controller("FrontendUserCtrl", ['$scope'
	, '$http'
	, '$window'
	, 'toastr'
	, '$timeout'
	, '$state'
	, 'userService'
	, 'authService'
	, 'appSetting'
	, '$uibModal', FrontendUserCtrl]);
function FrontendUserCtrl($scope
	, $http
	, $window
	, toastr
	, $timeout
	, $state
	, userService
	, authService
	, appSetting
	, $uibModal) {

	var ctrl = this;
	ctrl.status = ['Active', 'Inactive'];
	ctrl.pageSizes = [20, 50, 100, 200];
	ctrl.totalPage = 0;
	ctrl.criteria = {
		username: '',
		fullName: '',
		pageNumber: 1,
		pageSize: ctrl.pageSizes[0],
		total: 0,
		sortingOrder: 'u.FirstName',
		reverse: false,
		results: []
	}

	ctrl.goto = function (sel, obj) {
		if (sel === 'Dashboard') {
			$state.go('portal.dashboard');
		} else if (sel === 'AddFrontEndUser') {
			$state.go('portal.addfeuser');
		} else if (sel === 'EditFrontEndUser') {
			$state.go('portal.editfeuser', { obj: { mode: 'edit', data: obj.id } });
		}
	}

	ctrl.canView = false;
	ctrl.canEdit = false;
	ctrl.canView = authService.isGranted('view_frontenduser');
	ctrl.canEdit = authService.isGranted('modify_frontenduser');

	// chang sorting order
	ctrl.sort_by = function (newSortingOrder) {
		if (ctrl.criteria.sortingOrder == newSortingOrder)
			ctrl.criteria.reverse = !ctrl.criteria.reverse;

		ctrl.criteria.sortingOrder = newSortingOrder;

		ctrl.search(true);
	};

	ctrl.search = function (isClickSearch) {
		$('#searchresult').block({
			message: loading,
			css: { border: '0px', backgroundColor: 'none', fontSize: '0.4em' }
		});
		if (isClickSearch) {
			ctrl.criteria.pageNumber = 1;
			ctrl.criteria.pageSize = ctrl.pageSizes[0];
		}
		userService.searchFrontendUser(ctrl.criteria).then(function (r) {
			$('#searchresult').unblock();
			ctrl.criteria.total = r.total;
			ctrl.criteria.results = r.frontendUsers;
			let x = Math.floor(r.total / ctrl.criteria.pageSize);
			if ((r.total % ctrl.criteria.pageSize) >= 1)
				x = x + 1;

			ctrl.totalPage = x;
			// set priority of each category group

		}, function (err) {
			$('#searchresult').unblock();
			toastr.error(err.statusText, 'Error');
		});
	}
	ctrl.clearSearch = function () {
		ctrl.criteria = {
			username: '',
			fullName: '',
			pageNumber: 1,
			pageSize: ctrl.pageSizes[0],
			sortingOrder: 'u.FirstName',
			reverse: false,
			total: 0
		}
		ctrl.search();
	}
	ctrl.previousPage = function () {
		if (ctrl.criteria.pageNumber > 1 && ctrl.totalPage > 1) {
			ctrl.criteria.pageNumber = ctrl.criteria.pageNumber - 1;
			ctrl.search();
		}
	}
	ctrl.nextPage = function () {
		if (ctrl.criteria.pageNumber >= 1 && (ctrl.criteria.pageNumber < ctrl.totalPage)) {
			ctrl.criteria.pageNumber = ctrl.criteria.pageNumber + 1;
			ctrl.search();
		}
	}
	ctrl.changePageSize = function () {
		ctrl.criteria.pageNumber = 1;
		ctrl.search();
	}
	ctrl.showDelete = false;
	ctrl.toggleAll = function () {
		var toggleStatus = !ctrl.isAllSelected;
		if (toggleStatus) {
			ctrl.showDelete = true;
		} else {
			ctrl.showDelete = false;
		}
		angular.forEach(ctrl.criteria.results, function (itm) { itm.selected = toggleStatus; });
	}
	ctrl.optionToggled = function () {
		ctrl.isAllSelected = ctrl.criteria.results.every(function (itm) {
			return itm.selected;
		})
		let sel = false;
		angular.forEach(ctrl.criteria.results, function (value, key) {
			if (value.selected) {
				sel = true;
			}
		});
		if (sel)
			ctrl.showDelete = true;
		else
			ctrl.showDelete = false;
	}
	ctrl.delete = function () {

		var modalInstanceCtrl = ['$scope', '$uibModalInstance', function ($scope, $uibModalInstance) {
			$scope.submit = function () {
				$uibModalInstance.close(true);
			}
			$scope.close = function () {
				$uibModalInstance.close(false);
			}
		}];

		var modalInstance = $uibModal.open({
			animation: true,
			templateUrl: 'confirm-delete.html',
			controller: modalInstanceCtrl,
			backdrop: 'static',
			size: ''
		});

		modalInstance.result.then(function (confirmed) {
			if (confirmed) {
				let deletedIds = [];
				angular.forEach(ctrl.criteria.results, function (value, key) {
					if (value.selected) {
						deletedIds.push(value.id);
					}
				});
				if (deletedIds.length > 0) {
					ctrl.processing = true;
					userService.deleteFrontendUsers(deletedIds).then(function (r) {
						ctrl.processing = false;
						toastr.success("ลบรายการสำเร็จ");

						// reset toggle
						ctrl.isAllSelected = false;
						ctrl.showDelete = false;

						ctrl.search();
					}, function (err) {
						ctrl.processing = false;
						toastr.error(err.statusText, 'Error');
					});
				}
			}
		});
	}
	ctrl.updateFrontendUserStatus = function (obj) {
		userService.updateFrontendUserStatus(obj.id, obj.status).then(function (r) {
			toastr.success("บันทึกสำเร็จ");
			ctrl.search();
		}, function (err) {
			toastr.error(err.statusText, 'Error');
		});
	}

	ctrl.search();
}

angular.module("app").controller("AddAdminCtrl", ['$scope'
	, '$http'
	, '$window'
	, 'toastr'
	, '$timeout'
	, '$state'
	, 'userService'
	, 'authService'
	, 'appSetting'
	, '$uibModal', AddAdminCtrl]);
function AddAdminCtrl($scope
	, $http
	, $window
	, toastr
	, $timeout
	, $state
	, userService
	, authService
	, appSetting
	, $uibModal) {

	var ctrl = this;
	ctrl.processing = false;
	ctrl.status = ['Active', 'Inactive'];
	ctrl.groups = [];
	ctrl.searchCriteria = null;
	ctrl.model = {
		userID: null,
		firstName: null,
		lastName: null,
		department: null,
		email: null,
		officeNo: null,
		mobile: null,
		selectedGroup: null,
		status: "Active"
	};

	ctrl.goto = function (sel, obj) {
		if (sel === 'Dashboard') {
			$state.go('portal.dashboard');
		} else if (sel === 'AdminUser') {
			$state.go('portal.adminusers');
		}
	}

	ctrl.canView = false;
	ctrl.canEdit = false;
	ctrl.canView = authService.isGranted('view_adminuser');
	ctrl.canEdit = authService.isGranted('modify_adminuser');

	ctrl.getUserGroups = function () {
		userService.getUserGroups().then(function (rs) {
			ctrl.groups = rs;
			ctrl.model.selectedGroup = ctrl.groups ? ctrl.groups[0] : null;

		});
	}
	ctrl.getUserGroups();

	ctrl.search = function () {
		var modalInstanceCtrl = ['$scope', '$uibModalInstance', 'userService', 'toastr', 'userId', function ($scope, $uibModalInstance, userService, toastr, userId) {
			$scope.users = [];
			$scope.loading = true;
			userService.searchWebServiceUser(userId).then(function (rs) {
				$scope.loading = false;
				$scope.users = rs;
			}, function (err) {
				$scope.loading = false;
				toastr.error(err.statusText, 'Error');
			});

			$scope.selectUser = function (obj) {
				userService.anyWebServiceUser(obj.userID).then(function (found) {
					if (found) {
						toastr.warning("พบรายชื่อนี้อยู่ระบบเรียบร้อยแล้ว");
					} else {
						$uibModalInstance.close(obj);
					}
				});
			}
			$scope.close = function () {
				$uibModalInstance.close(false);
			}
		}];

		var modalInstance = $uibModal.open({
			animation: true,
			templateUrl: 'search-user.html',
			controller: modalInstanceCtrl,
			backdrop: 'static',
			size: '',
			resolve: {
				userId: function () { return ctrl.searchCriteria; }
			}
		});

		modalInstance.result.then(function (obj) {
			ctrl.searchCriteria = obj.userID;
			if (obj) {
				ctrl.model = {
					userID: obj.userID,
					firstName: obj.firstName,
					lastName: obj.lastName,
					department: obj.department,
					email: obj.email,
					officeNo: obj.officeNo,
					mobile: obj.mobile,
					selectedGroup: ctrl.groups ? ctrl.groups[0] : null,
					status: "Active"
				}
			}
		});
	}
	ctrl.resetForm = function () {
		ctrl.searchCriteria = null;
		ctrl.model = {
			userID: null,
			firstName: null,
			lastName: null,
			department: null,
			email: null,
			officeNo: null,
			mobile: null,
			selectedGroup: ctrl.groups ? ctrl.groups[0] : null,
			status: "Active"
		};
	}

	ctrl.submit = function (valid) {
		ctrl.searchCriteria = null;
		if (valid && ctrl.model.userID) {
			let postObj = {
				userID: ctrl.model.userID,
				firstName: ctrl.model.firstName,
				lastName: ctrl.model.lastName,
				department: ctrl.model.department,
				email: ctrl.model.email,
				officePhoneNumber: ctrl.model.officeNo,
				mobilePhoneNumber: ctrl.model.mobile,
				groupID: ctrl.model.selectedGroup.id,
				status: ctrl.model.status
			};

			ctrl.processing = true;
			userService.addWebServiceUser(postObj).then(function (r) {
				ctrl.processing = false;
				toastr.success("บันทึกสำเร็จ");
				ctrl.resetForm();
			}, function (err) {
				ctrl.processing = false;
				ctrl.resetForm();
				toastr.error(err.statusText, 'Error');
			});
		}
		else {
			toastr.warning('กรุณาค้นหาและเลือกรายชื่อที่ต้องการ.');
		}
	}
}
angular.module("app").controller("AddCorperate", ['$scope'
	, '$http'
	, '$window'
	, 'toastr'
	, '$timeout'
	, '$state'
	, 'userService'
	, 'authService'
	, 'appSetting'
	, '$uibModal', AddCorperate]);
function AddCorperate($scope
	, $http
	, $window
	, toastr
	, $timeout
	, $state
	, userService
	, authService
	, appSetting
	, $uibModal) {

	var ctrl = this;
	ctrl.processing = false;
	ctrl.status = ['Active', 'Inactive'];
	ctrl.groups = [];
	ctrl.searchCriteria = null;
	ctrl.model = {
		Code: "",
		FNAME: "",
		LNAME: "",
		unitabbr: "",
		EmailAddr: "",
		active: true,
		status: "Active"
	};
	ctrl.type = "PTT";
	ctrl.type_change = function () {

	}
	ctrl.goto = function (sel, obj) {
		if (sel === 'Dashboard') {
			$state.go('portal.dashboard');
		} else if (sel === 'CorperateList') {
			$state.go('portal.corperateList');
		}
	}
	var require = function (x) {
		return x.filter(function (x) {
			return ctrl.model[x] == "";
		}).length == 0;
	}
	ctrl.submitted = false;
	ctrl.saveCorperate = function () {
		ctrl.submitted = true;
		if (require(["FNAME", "LNAME", "unitabbr", "EmailAddr", "Code"])) {
			ctrl.processing = true;
			var body = JSON.parse((JSON.stringify(ctrl.model)));
			var fd = new FormData();
			// ctrl.editObj.Tableau_Workbook_Name=ctrl.editObj.Tableau_Workbook_ID;
			fd.append("Code", body.Code);
			fd.append("FNAMe", body.FNAME);
			fd.append("LNAME", body.LNAME);
			fd.append("unitabbr", body.unitabbr);
			fd.append("EmailAddr", body.EmailAddr);
			fd.append("Active", body.status == "Active");
			fd.append("CorperateType", ctrl.type == "PTT" ? 1 : 2);
			$http.post(appSetting.apiBaseUrl + '/api/corperate/saveCorperate', fd, {
				transformRequest: angular.identity,
				headers: {
					'Content-Type': undefined
				}
			}).then(function (r) {
				ctrl.processing = false;
				toastr.success("บันทึกสำเร็จ");

				ctrl.submit = false;
				ctrl.model = {
					Code: "",
					FNAME: "",
					LNAME: "",
					unitabbr: "",
					EmailAddr: "",
					active: true,
					status: "Active"
				};
				ctrl.type = "PTT";
				ctrl.submitted=false;
				$scope.frmCategory.$setPristine();
				$scope.frmCategory.$setUntouched();

			}, function (err) {
				ctrl.submitted = false;
				ctrl.processing = false;
				toastr.error(err.statusText, 'Error');
				// ctrl.goto("AllDashboardReport");
				$scope.frmCategory.$setPristine();
				$scope.frmCategory.$setUntouched();
			});
		} else {
			console.log("required")
		}
	}
	ctrl.canView = false;
	ctrl.canEdit = false;
	ctrl.canView = authService.isGranted('view_adminuser');
	ctrl.canEdit = authService.isGranted('modify_adminuser');

	ctrl.getUserGroups = function () {
		userService.getUserGroups().then(function (rs) {
			ctrl.groups = rs;
			ctrl.model.selectedGroup = ctrl.groups ? ctrl.groups[0] : null;

		});
	}
	ctrl.getUserGroups();

	ctrl.search = function () {
		var modalInstanceCtrl = ['$scope', '$uibModalInstance', 'userService', 'toastr', 'userId', function ($scope, $uibModalInstance, userService, toastr, userId) {
			$scope.users = [];
			$scope.loading = true;
			userService.searchWebServiceUser(userId).then(function (rs) {
				$scope.loading = false;
				$scope.users = rs;
			}, function (err) {
				$scope.loading = false;
				toastr.error(err.statusText, 'Error');
			});

			$scope.selectUser = function (obj) {
				userService.anyWebServiceCorperateUser(obj.userID).then(function (found) {
					if (found) {
						toastr.warning("พบรายชื่อนี้อยู่ระบบเรียบร้อยแล้ว");
					} else {
						$uibModalInstance.close(obj);
					}
				});
			}
			$scope.close = function () {
				$uibModalInstance.close(false);
			}
		}];

		var modalInstance = $uibModal.open({
			animation: true,
			templateUrl: 'search-user.html',
			controller: modalInstanceCtrl,
			backdrop: 'static',
			size: '',
			resolve: {
				userId: function () { return ctrl.searchCriteria; }
			}
		});

		modalInstance.result.then(function (obj) {
			ctrl.searchCriteria = obj.userID;
			if (obj) {
				ctrl.model = {
					Code: obj.userID,
					FNAME: obj.firstName,
					LNAME: obj.lastName,
					unitabbr: obj.department,
					EmailAddr: obj.email,


					status: "Active"
				}
			}
		});
	}
	ctrl.resetForm = function () {
		ctrl.searchCriteria = null;
		ctrl.model = {
			Code: "",
			FNAME: "",
			LNAME: "",
			unitabbr: "",
			EmailAddr: "",
			active: true,
			status: "Active"
		};
	}

	ctrl.submit = function (valid) {
		ctrl.searchCriteria = null;
		if (valid && ctrl.model.userID) {
			let postObj = {
				userID: ctrl.model.userID,
				firstName: ctrl.model.firstName,
				lastName: ctrl.model.lastName,
				department: ctrl.model.department,
				email: ctrl.model.email,
				officePhoneNumber: ctrl.model.officeNo,
				mobilePhoneNumber: ctrl.model.mobile,
				groupID: ctrl.model.selectedGroup.id,
				status: ctrl.model.status
			};

			ctrl.processing = true;
			userService.addWebServiceUser(postObj).then(function (r) {
				ctrl.processing = false;
				toastr.success("บันทึกสำเร็จ");
				ctrl.model = {
					Code: "",
					FNAME: "",
					LNAME: "",
					unitabbr: "",
					EmailAddr: "",
					active: true,
					status: "Active"
				};
				
			}, function (err) {
				ctrl.processing = false;
				// ctrl.resetForm();
				toastr.error(err.statusText, 'Error');
			});
		}
		else {
			toastr.warning('กรุณาค้นหาและเลือกรายชื่อที่ต้องการ.');
		}
	}
}
angular.module("app").controller("EditCorperate", ['$scope'
	, '$http'
	, '$window'
	, 'toastr'
	, '$timeout'
	, '$state'
	, 'userService'
	, 'authService'
	, 'appSetting'
	, '$stateParams'
	, 'storageService'
	, '$uibModal', EditCorperate]);
function EditCorperate($scope
	, $http
	, $window
	, toastr
	, $timeout
	, $state
	, userService
	, authService
	, appSetting
	, $stateParams
	, storageService
	, $uibModal) {

	var ctrl = this;
	ctrl.processing = false;
	ctrl.status = ['Active', 'Inactive'];
	ctrl.groups = [];
	ctrl.searchCriteria = null;
	var obj;
	ctrl.type = "PTT";
	if ($stateParams.obj !== null) {
		localStorage.setItem('corperateModel', JSON.stringify($stateParams.obj));
		console.log(localStorage.getItem('corperateModel'))
	}

	if (localStorage.getItem('corperateModel') !== null && localStorage.getItem('corperateModel') !== undefined) {

		obj = JSON.parse(localStorage.getItem('corperateModel'));
		console.log(obj);
		ctrl.type = obj.data.corperateType == 2 ? "BSA" : "PTT";
		console.log(ctrl.type);
	}

	// var {code,id,fname,lname,unitabbr,emailAddr,active}=obj.data;
	console.log(obj.data);

	ctrl.model = {
		id: obj.data.id,
		Code: obj.data.code,
		FNAME: obj.data.fname,
		LNAME: obj.data.lname,
		unitabbr: obj.data.unitabbr,
		EmailAddr: obj.data.emailAddr,
		active: obj.data.active,
		status: obj.data.active ? "Active" : "Inactive"
	};


	ctrl.goto = function (sel, obj) {
		if (sel === 'Dashboard') {
			$state.go('portal.dashboard');
		} else if (sel === 'CorperateList') {
			$state.go('portal.corperateList');
		}
	}
	var require = function (x) {
		return x.filter(function (x) {
			return ctrl.model[x] == "";
		}).length == 0;
	}
	ctrl.submitted = false;
	ctrl.saveCorperate = function () {
		ctrl.submitted = true;
		if (require(["FNAME", "LNAME", "unitabbr", "EmailAddr", "Code"])) {
			ctrl.processing = true;
			var body = JSON.parse((JSON.stringify(ctrl.model)));
			var fd = new FormData();
			// ctrl.editObj.Tableau_Workbook_Name=ctrl.editObj.Tableau_Workbook_ID;
			console.log(body)
			fd.append("Code", body.Code);
			fd.append("FNAMe", body.FNAME);
			fd.append("LNAME", body.LNAME);
			fd.append("unitabbr", body.unitabbr);
			fd.append("EmailAddr", body.EmailAddr);
			fd.append("id", body.id);
			fd.append("Active", body.status == "Active");
			fd.append("CorperateType", ctrl.type == "PTT" ? 1 : 2);
			$http.post(appSetting.apiBaseUrl + '/api/corperate/saveCorperate', fd, {
				transformRequest: angular.identity,
				headers: {
					'Content-Type': undefined
				}
			}).then(function (r) {
				ctrl.processing = false;
				toastr.success("บันทึกสำเร็จ");

				ctrl.submit = false;
				// ctrl.goto("AllDashboardReport");
				$scope.frmCategory.$setPristine();
				$scope.frmCategory.$setUntouched();

			}, function (err) {
				ctrl.submitted = false;
				ctrl.processing = false;
				toastr.error(err.statusText, 'Error');
				// ctrl.goto("AllDashboardReport");
				$scope.frmCategory.$setPristine();
				$scope.frmCategory.$setUntouched();
			});
		} else {
			console.log("required")
		}
	}
	ctrl.canView = false;
	ctrl.canEdit = false;
	ctrl.canView = authService.isGranted('view_adminuser');
	ctrl.canEdit = authService.isGranted('modify_adminuser');

	ctrl.getUserGroups = function () {
		userService.getUserGroups().then(function (rs) {
			ctrl.groups = rs;
			ctrl.model.selectedGroup = ctrl.groups ? ctrl.groups[0] : null;

		});
	}
	ctrl.getUserGroups();

	ctrl.search = function () {
		var modalInstanceCtrl = ['$scope', '$uibModalInstance', 'userService', 'toastr', 'userId', function ($scope, $uibModalInstance, userService, toastr, userId) {
			$scope.users = [];
			$scope.loading = true;
			userService.searchWebServiceUser(userId).then(function (rs) {
				$scope.loading = false;
				$scope.users = rs;
			}, function (err) {
				$scope.loading = false;
				toastr.error(err.statusText, 'Error');
			});

			$scope.selectUser = function (obj) {
				userService.anyWebServiceUser(obj.userID).then(function (found) {
					if (found) {
						toastr.warning("พบรายชื่อนี้อยู่ระบบเรียบร้อยแล้ว");
					} else {
						$uibModalInstance.close(obj);
					}
				});
			}
			$scope.close = function () {
				$uibModalInstance.close(false);
			}
		}];

		var modalInstance = $uibModal.open({
			animation: true,
			templateUrl: 'search-user.html',
			controller: modalInstanceCtrl,
			backdrop: 'static',
			size: '',
			resolve: {
				userId: function () { return ctrl.searchCriteria; }
			}
		});

		modalInstance.result.then(function (obj) {
			ctrl.searchCriteria = obj.userID;
			if (obj) {
				ctrl.model = {
					Code: obj.userID,
					FNAME: obj.firstName,
					LNAME: obj.lastName,
					unitabbr: obj.department,
					EmailAddr: obj.email,


					status: "Active"
				}
			}
		});
	}
	ctrl.resetForm = function () {
		ctrl.searchCriteria = null;
		ctrl.model = {
			userID: null,
			firstName: null,
			lastName: null,
			department: null,
			email: null,
			officeNo: null,
			mobile: null,
			selectedGroup: ctrl.groups ? ctrl.groups[0] : null,
			status: "Active"
		};
	}

	ctrl.submit = function (valid) {
		ctrl.searchCriteria = null;
		if (valid && ctrl.model.userID) {
			let postObj = {
				userID: ctrl.model.userID,
				firstName: ctrl.model.firstName,
				lastName: ctrl.model.lastName,
				department: ctrl.model.department,
				email: ctrl.model.email,
				officePhoneNumber: ctrl.model.officeNo,
				mobilePhoneNumber: ctrl.model.mobile,
				groupID: ctrl.model.selectedGroup.id,
				status: ctrl.model.status
			};

			ctrl.processing = true;
			userService.addWebServiceUser(postObj).then(function (r) {
				ctrl.processing = false;
				toastr.success("บันทึกสำเร็จ");
				ctrl.resetForm();
			}, function (err) {
				ctrl.processing = false;
				ctrl.resetForm();
				toastr.error(err.statusText, 'Error');
			});
		}
		else {
			toastr.warning('กรุณาค้นหาและเลือกรายชื่อที่ต้องการ.');
		}
	}
}
angular.module("app").controller("EditAdminCtrl", ['$scope'
	, '$http'
	, '$window'
	, 'toastr'
	, '$timeout'
	, '$state'
	, '$stateParams'
	, 'userService'
	, 'authService'
	, 'storageService'
	, 'appSetting'
	, '$uibModal', EditAdminCtrl]);
function EditAdminCtrl($scope
	, $http
	, $window
	, toastr
	, $timeout
	, $state
	, $stateParams
	, userService
	, authService
	, storageService
	, appSetting
	, $uibModal) {

	var ctrl = this;
	ctrl.processing = false;
	ctrl.status = ['Active', 'Inactive'];
	ctrl.groups = [];
	ctrl.searchCriteria = null;
	ctrl.model = {
		id: null,
		firstName: null,
		lastName: null,
		department: null,
		email: null,
		selectedGroup: null,
		status: "Active"
	};

	ctrl.goto = function (sel, obj) {
		if (sel === 'Dashboard') {
			$state.go('portal.dashboard');
		} else if (sel === 'AdminUser') {
			$state.go('portal.adminusers');
		}
	}

	ctrl.canView = false;
	ctrl.canEdit = false;
	ctrl.canView = authService.isGranted('view_adminuser');
	ctrl.canEdit = authService.isGranted('modify_adminuser');

	ctrl.stateModel = $stateParams.obj;
	if ($stateParams.obj !== null) {
		storageService.setData('adUserModel', $stateParams.obj);
	}
	if (storageService.getData('adUserModel') !== null && storageService.getData('adUserModel') !== undefined) {
		ctrl.stateModel = storageService.getData('adUserModel');
	}

	ctrl.getUserGroups = function () {
		userService.getUserGroups().then(function (rs) {
			ctrl.groups = rs;
			ctrl.model.selectedGroup = ctrl.groups ? ctrl.groups[0] : null;
			let id = ctrl.stateModel.data.id;
			ctrl.getEditUserData(id);
		});
	}
	ctrl.getUserGroups();

	ctrl.getEditUserData = function (userId) {
		// get edit data by id
		userService.getAdminUserData(userId).then(function (obj) {
			ctrl.model = {
				id: obj.id,
				userId: obj.username,
				firstName: obj.firstName,
				lastName: obj.lastName,
				department: obj.department,
				email: obj.email,
				mobilePhoneNumber: obj.mobilePhoneNumber,
				officePhoneNumber: obj.officePhoneNumber,
				selectedGroup: null,
				status: obj.status
			};

			angular.forEach(ctrl.groups, function (value, key) {
				if (obj.groupID === value.id)
					ctrl.model.selectedGroup = value;
			});
		});
	}

	ctrl.resetForm = function () {
		ctrl.searchCriteria = null;
		ctrl.model = {
			userID: null,
			firstName: null,
			lastName: null,
			department: null,
			email: null,
			selectedGroup: ctrl.groups ? ctrl.groups[0] : null,
			status: "Active"
		};
	}

	ctrl.submit = function (valid) {
		ctrl.searchCriteria = null;
		if (valid && ctrl.model.id) {
			let postObj = {
				id: ctrl.model.id,
				firstName: ctrl.model.firstName,
				lastName: ctrl.model.lastName,
				department: ctrl.model.department,
				email: ctrl.model.email,
				groupID: ctrl.model.selectedGroup.id,
				status: ctrl.model.status
			};

			ctrl.processing = true;
			userService.saveAdminUserData(postObj).then(function (r) {
				ctrl.processing = false;
				toastr.success("บันทึกสำเร็จ");
				ctrl.getEditUserData(r.id);
			}, function (err) {
				ctrl.processing = false;
				toastr.error(err.statusText, 'Error');
			});
		}
	}
}

angular.module("app").controller("AddFrontendUserCtrl", ['$scope'
	, '$http'
	, '$window'
	, 'toastr'
	, '$timeout'
	, '$state'
	, 'userService'
	, 'authService'
	, 'appSetting'
	, '$uibModal', AddFrontendUserCtrl]);
function AddFrontendUserCtrl($scope
	, $http
	, $window
	, toastr
	, $timeout
	, $state
	, userService
	, authService
	, appSetting
	, $uibModal) {

	var ctrl = this;
	ctrl.processing = false;
	ctrl.status = ['Active', 'Inactive'];
	ctrl.groups = [];
	ctrl.searchCriteria = null;
	ctrl.companies = [];
	ctrl.model = {
		id: null,
		username: null,
		password: null,
		firstName: null,
		lastName: null,
		department: null,
		email: null,
		selectedGroup: null,
		selectedCompany: null,
		status: "Active"
	};

	ctrl.goto = function (sel, obj) {
		if (sel === 'Dashboard') {
			$state.go('portal.dashboard');
		} else if (sel === 'FrontEndUser') {
			$state.go('portal.frontusers');
		} else if (sel === 'EditFrontEndUser') {
			$state.go('portal.editfeuser', { obj: { mode: 'edit', data: obj } });
		}
	}

	ctrl.canView = false;
	ctrl.canEdit = false;
	ctrl.canView = authService.isGranted('view_frontenduser');
	ctrl.canEdit = authService.isGranted('modify_frontenduser');


	ctrl.getFrontEndUserMaster = function () {
		userService.getFrontEndUserMaster().then(function (rs) {
			ctrl.groups = rs.permissions;
			ctrl.companies = rs.companies;
			ctrl.model.selectedGroup = ctrl.groups ? ctrl.groups[0] : null;
			ctrl.model.selectedCompany = ctrl.companies ? ctrl.companies[0] : null;

		});
	}
	ctrl.getFrontEndUserMaster();

	ctrl.resetForm = function () {
		ctrl.searchCriteria = null;
		ctrl.model = {
			id: null,
			username: null,
			password: null,
			firstName: null,
			lastName: null,
			department: null,
			email: null,
			selectedGroup: ctrl.groups ? ctrl.groups[0] : null,
			selectedCompany: ctrl.companies ? ctrl.companies[0] : null,
			status: "Active"
		};
	}

	ctrl.submit = function (valid) {
		angular.forEach($scope.frmEdit.$$controls, function (field) {
			field.$setDirty();
			field.$validate();
		});

		if (valid) {
			let postObj = {
				id: 0,
				username: ctrl.model.username,
				password: ctrl.model.password,
				companyID: ctrl.model.selectedCompany.id,
				firstName: ctrl.model.firstName,
				lastName: ctrl.model.lastName,
				department: ctrl.model.department,
				email: ctrl.model.email,
				groupID: ctrl.model.selectedGroup.id,
				status: ctrl.model.status
			};

			ctrl.processing = true;
			userService.addFrontEndUser(postObj).then(function (id) {
				ctrl.processing = false;
				toastr.success("บันทึกสำเร็จ");
				//goto edit form
				ctrl.goto('EditFrontEndUser', id);
			}, function (err) {
				ctrl.processing = false;
				toastr.error(err.statusText + ':' + err.data, 'Error');
			});
		}
	}
}

angular.module("app").controller("EditFrontendUserCtrl", ['$scope'
	, '$http'
	, '$window'
	, 'toastr'
	, '$timeout'
	, '$state'
	, '$stateParams'
	, 'userService'
	, 'authService'
	, 'storageService'
	, 'appSetting'
	, '$uibModal', EditFrontendUserCtrl]);
function EditFrontendUserCtrl($scope
	, $http
	, $window
	, toastr
	, $timeout
	, $state
	, $stateParams
	, userService
	, authService
	, storageService
	, appSetting
	, $uibModal) {

	var ctrl = this;
	ctrl.processing = false;
	ctrl.status = ['Active', 'Inactive'];
	ctrl.groups = [];
	ctrl.searchCriteria = null;
	ctrl.companies = [];
	ctrl.model = {
		id: null,
		username: null,
		password: null,
		firstName: null,
		lastName: null,
		department: null,
		email: null,
		selectedGroup: null,
		selectedCompany: null,
		status: "Active"
	};

	ctrl.goto = function (sel, obj) {
		if (sel === 'Dashboard') {
			$state.go('portal.dashboard');
		} else if (sel === 'FrontEndUser') {
			$state.go('portal.frontusers');
		}
	}

	ctrl.canView = false;
	ctrl.canEdit = false;
	ctrl.canView = authService.isGranted('view_frontenduser');
	ctrl.canEdit = authService.isGranted('modify_frontenduser');

	ctrl.stateModel = $stateParams.obj;
	if ($stateParams.obj !== null) {
		storageService.setData('feUserModel', $stateParams.obj);
	}
	if (storageService.getData('feUserModel') !== null && storageService.getData('feUserModel') !== undefined) {
		ctrl.stateModel = storageService.getData('feUserModel');
	}
	ctrl.getFrontEndUserMaster = function () {
		userService.getFrontEndUserMaster().then(function (rs) {
			ctrl.groups = rs.permissions;
			ctrl.companies = rs.companies;
			ctrl.model.selectedGroup = ctrl.groups ? ctrl.groups[0] : null;
			ctrl.model.selectedCompany = ctrl.companies ? ctrl.companies[0] : null;

			ctrl.getEditFrontEndUser(ctrl.stateModel.data);
		});
	}
	ctrl.getFrontEndUserMaster();


	ctrl.getEditFrontEndUser = function (id) {
		userService.getFrontEndUser(id).then(function (r) {
			ctrl.model = {
				id: r.id,
				username: r.username,
				password: r.password,
				firstName: r.firstName,
				lastName: r.lastName,
				department: r.department,
				email: r.email,
				selectedGroup: ctrl.groups ? ctrl.groups[0] : null,
				selectedCompany: ctrl.companies ? ctrl.companies[0] : null,
				status: r.status
			};

			angular.forEach(ctrl.groups, function (value, key) {
				if (r.groupID === value.id)
					ctrl.model.selectedGroup = value;
			});
			angular.forEach(ctrl.companies, function (value, key) {
				if (r.companyID === value.id)
					ctrl.model.selectedCompany = value;
			});
		});
	}

	ctrl.resetForm = function () {
		ctrl.searchCriteria = null;
		ctrl.model = {
			id: null,
			username: null,
			password: null,
			firstName: null,
			lastName: null,
			department: null,
			email: null,
			selectedGroup: ctrl.groups ? ctrl.groups[0] : null,
			selectedCompany: ctrl.companies ? ctrl.companies[0] : null,
			status: "Active"
		};
	}

	ctrl.submit = function (valid) {
		angular.forEach($scope.frmEdit.$$controls, function (field) {
			field.$setDirty();
			field.$validate();
		});

		if (valid && ctrl.model.id) {
			let postObj = {
				id: ctrl.model.id,
				username: ctrl.model.username,
				password: ctrl.model.password,
				companyID: ctrl.model.selectedCompany.id,
				firstName: ctrl.model.firstName,
				lastName: ctrl.model.lastName,
				department: ctrl.model.department,
				email: ctrl.model.email,
				groupID: ctrl.model.selectedGroup.id,
				status: ctrl.model.status
			};

			ctrl.processing = true;
			userService.editFrontEndUser(postObj).then(function (r) {
				ctrl.processing = false;
				toastr.success("บันทึกสำเร็จ");
				//goto edit form
			}, function (err) {
				ctrl.processing = false;
				//ctrl.resetForm();
				toastr.error(err.statusText + ':' + err.data, 'Error');
			});
		}
	}
}

angular.module("app").controller("ActivityLogCtrl", ['$scope', '$http', '$window', 'toastr', 'authService', 'logService', '$state', '$timeout', '$uibModal', 'FileSaver', 'Blob', 'appSetting', ActivityLogCtrl]);
function ActivityLogCtrl($scope, $http, $window, toastr, authService, logService, $state, $timeout, $uibModal, FileSaver, Blob, appSetting) {
	var ctrl = this;

	ctrl.pageSizes = [20, 50, 100, 200];
	ctrl.totalPage = 0;
	ctrl.criteria = {
		userId: '',
		dateFrom: getCurrentDateStr(),
		dateTo: getCurrentDateStr(),
		pageNumber: 1,
		pageSize: ctrl.pageSizes[0],
		total: 0,
		events: '',
		results: []
	}

	ctrl.canView = false;
	ctrl.canEdit = false;
	ctrl.canView = authService.isGranted('view_activity_log');
	ctrl.canEdit = authService.isGranted('modify_activity_log');

	ctrl.search = function (isClickSearch) {
		$('#searchresult').block({
			message: loading,
			css: { border: '0px', backgroundColor: 'none', fontSize: '0.4em' }
		});
		if (isClickSearch) {
			ctrl.criteria.pageNumber = 1;
			ctrl.criteria.pageSize = ctrl.pageSizes[0];
		}
		logService.searchActivityLog(ctrl.criteria).then(function (r) {
			$('#searchresult').unblock();
			ctrl.criteria.total = r.total;
			ctrl.criteria.results = r.logs;
			let x = Math.floor(r.total / ctrl.criteria.pageSize);
			if ((r.total % ctrl.criteria.pageSize) >= 1)
				x = x + 1;

			ctrl.totalPage = x;
		}, function (err) {
			$('#searchresult').unblock();
			toastr.error(err.statusText, 'Error');
		});
	}
	ctrl.clearSearch = function () {
		ctrl.criteria = {
			userId: '',
			dateFrom: getCurrentDateStr(),
			dateTo: getCurrentDateStr(),
			pageNumber: 1,
			pageSize: ctrl.pageSizes[0],
			total: 0,
			results: []
		}
		ctrl.search();
	}
	ctrl.previousPage = function () {
		if (ctrl.criteria.pageNumber > 1 && ctrl.totalPage > 1) {
			ctrl.criteria.pageNumber = ctrl.criteria.pageNumber - 1;
			ctrl.search();
		}
	}
	ctrl.nextPage = function () {
		if (ctrl.criteria.pageNumber >= 1 && (ctrl.criteria.pageNumber < ctrl.totalPage)) {
			ctrl.criteria.pageNumber = ctrl.criteria.pageNumber + 1;
			ctrl.search();
		}
	}
	ctrl.changePageSize = function () {
		ctrl.criteria.pageNumber = 1;
		ctrl.search();
	}

	ctrl.goto = function (sel, obj) {
		if (sel === 'Dashboard') {
			$state.go('portal.dashboard');
		}
	}
	ctrl.download = function () {
		$http({
			method: 'POST',
			url: appSetting.apiBaseUrl + '/api/log/exportActivityLog',
			data: {
				userId: ctrl.criteria.userId,
				dateFrom: ctrl.criteria.dateFrom,
				dateTo: ctrl.criteria.dateTo
			},
			responseType: 'blob'
		}).then(function successCallback(response) {
			let fname = 'ActivityLog-' + getCurrentDateFileNameStr() + '.xlsx';
			FileSaver.saveAs(response.data, fname);
		}, function errorCallback(response) {
			toastr.error("download error", 'Error');
		});
	};

	// init data
	ctrl.search();
}

angular.module("app").controller("UsageLogCtrl", ['$scope', '$http', '$window', 'toastr', 'authService', 'logService', '$state', '$timeout', '$uibModal', 'FileSaver', 'Blob', 'appSetting', UsageLogCtrl]);
function UsageLogCtrl($scope, $http, $window, toastr, authService, logService, $state, $timeout, $uibModal, FileSaver, Blob, appSetting) {
	var ctrl = this;

	ctrl.pageSizes = [20, 50, 100, 200];
	ctrl.totalPage = 0;
	ctrl.criteria = {
		userId: '',
		dateFrom: getCurrentDateStr(),
		dateTo: getCurrentDateStr(),
		pageNumber: 1,
		pageSize: ctrl.pageSizes[0],
		total: 0,
		events: '',
		results: []
	}

	ctrl.canView = false;
	ctrl.canEdit = false;
	ctrl.canView = authService.isGranted('view_usage_log');
	ctrl.canEdit = authService.isGranted('modify_usage_log');


	ctrl.search = function (isClickSearch) {
		$('#searchresult').block({
			message: loading,
			css: { border: '0px', backgroundColor: 'none', fontSize: '0.4em' }
		});
		if (isClickSearch) {
			ctrl.criteria.pageNumber = 1;
			ctrl.criteria.pageSize = ctrl.pageSizes[0];
		}
		logService.searchUsageLog(ctrl.criteria).then(function (r) {
			$('#searchresult').unblock();
			ctrl.criteria.total = r.total;
			ctrl.criteria.results = r.logs;
			let x = Math.floor(r.total / ctrl.criteria.pageSize);
			if ((r.total % ctrl.criteria.pageSize) >= 1)
				x = x + 1;

			ctrl.totalPage = x;
		}, function (err) {
			$('#searchresult').unblock();
			toastr.error(err.statusText, 'Error');
		});
	}
	ctrl.clearSearch = function () {
		ctrl.criteria = {
			userId: '',
			dateFrom: getCurrentDateStr(),
			dateTo: getCurrentDateStr(),
			pageNumber: 1,
			pageSize: ctrl.pageSizes[0],
			total: 0,
			results: []
		}
		ctrl.search();
	}
	ctrl.previousPage = function () {
		if (ctrl.criteria.pageNumber > 1 && ctrl.totalPage > 1) {
			ctrl.criteria.pageNumber = ctrl.criteria.pageNumber - 1;
			ctrl.search();
		}
	}
	ctrl.nextPage = function () {
		if (ctrl.criteria.pageNumber >= 1 && (ctrl.criteria.pageNumber < ctrl.totalPage)) {
			ctrl.criteria.pageNumber = ctrl.criteria.pageNumber + 1;
			ctrl.search();
		}
	}
	ctrl.changePageSize = function () {
		ctrl.criteria.pageNumber = 1;
		ctrl.search();
	}

	ctrl.goto = function (sel, obj) {
		if (sel === 'Dashboard') {
			$state.go('portal.dashboard');
		}
	}

	ctrl.download = function () {
		$http({
			method: 'POST',
			url: appSetting.apiBaseUrl + '/api/log/exportUsageLog',
			data: {
				userId: ctrl.criteria.userId,
				dateFrom: ctrl.criteria.dateFrom,
				dateTo: ctrl.criteria.dateTo
			},
			responseType: 'blob'
		}).then(function successCallback(response) {
			let fname = 'UsageLog-' + getCurrentDateFileNameStr() + '.xlsx';
			FileSaver.saveAs(response.data, fname);
		}, function errorCallback(response) {
			toastr.error("download error", 'Error');
		});
	};

	// init data
	ctrl.search();
}