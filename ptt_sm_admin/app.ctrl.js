(function () {
	'use strict';

	angular.module("app").controller("DashboardCtrl", ['$scope', '$timeout', 'toastr', 'authService', '$window', '$rootScope', '$sce', '$state', 'dashboardService', DashboardCtrl]);
	function DashboardCtrl($scope, $timeout, toastr, authService, $window, $rootScope, $sce, $state, dashboardService) {
		var ctrl = this;
		ctrl.totalNews = 0;
		ctrl.totalDownload = 0;
		ctrl.totalApplication = 0;
		ctrl.totalPolicy = 0;
		ctrl.totalAbout = 0;
		ctrl.totalFAQ = 0;
		ctrl.totalGroup = 0;
		ctrl.totalMedia = 0;
		ctrl.loading = true;

		//permission control
		ctrl.canViewAbout = false;
		ctrl.canViewApplications = false;
		ctrl.viewNews = false;
		ctrl.canViewPolicy = false;
		ctrl.canViewDownload = false;
		ctrl.canViewContactList = false;
		ctrl.canViewFaqs = false;
		ctrl.canViewUserGroup = false;
		ctrl.canViewAdminUser = false;
		ctrl.canViewFrontendUser = false;
		ctrl.canEditAbout = false;
		ctrl.canEditApplications = false;
		ctrl.canEditNews = false;
		ctrl.canEditPolicy = false;
		ctrl.canEditDownload = false;
		ctrl.canEditContactList = false;
		ctrl.canEditFaqs = false;

		// ctrl.canViewDefualtCoverImage

		ctrl.canViewAbout = authService.isGranted('view_about');
		ctrl.canEditAbout = authService.isGranted('modify_about');
		ctrl.canViewApplications = authService.isGranted('view_applications');
		ctrl.canEditApplications = authService.isGranted('modify_applications');
		ctrl.viewNews = authService.isGranted('view_news');
		ctrl.canEditNews = authService.isGranted('modify_news');
		ctrl.canViewPolicy = authService.isGranted('view_policy');
		ctrl.canEditPolicy = authService.isGranted('modify_policy');
		ctrl.canViewDownload = authService.isGranted('view_download');
		ctrl.canEditDownload = authService.isGranted('modify_download');
		ctrl.canViewContactList = authService.isGranted('view_contactlist');
		ctrl.canEditContactList = authService.isGranted('modify_contactlist');
		ctrl.canViewFaqs = authService.isGranted('view_faqs');
		ctrl.canEditFaqs = authService.isGranted('modify_faqs');

		ctrl.canEditAdminUser = false;
		ctrl.canEditUserGroup = false;
		ctrl.canEditFrontendUser = false;
		ctrl.canViewUserGroup = authService.isGranted('view_usergroup');
		ctrl.canViewAdminUser = authService.isGranted('view_adminuser');
		ctrl.canViewFrontendUser = authService.isGranted('view_frontenduser');
		ctrl.canEditUserGroup = authService.isGranted('modify_usergroup');
		ctrl.canEditAdminUser = authService.isGranted('modify_adminuser');
		ctrl.canEditFrontendUser = authService.isGranted('modify_frontenduser');
		
		ctrl.canViewDefualtCoverImage=true;
		dashboardService.getDashboardSummary().then(function (r) {
			ctrl.totalNews = r.totalNews;
			ctrl.totalDownload = r.totalDownload;
			ctrl.totalApplication = r.totalApplication;
			ctrl.totalPolicy = r.totalPolicy;
			ctrl.totalAbout = r.totalAbout;
			ctrl.totalFAQ = r.totalFAQ;
			ctrl.totalGroup = r.totalGroup;
			ctrl.totalMedia = r.totalMedia;
			$timeout(function () {
				ctrl.loading = false;
			}, 200);
		}, function (err) {
			ctrl.loading = false;
			if (err.data)
				toastr.error(err.data.MessageDetail, 'Error');
			else
				toastr.error(err.Message, 'Error');
		});

		ctrl.goto = function (sel) {
			if (sel === 'AllNews') {
				$state.go('portal.news');
			} else if (sel === 'AllDownload') {
				$state.go('portal.download');
			} else if (sel === 'AboutCategory') {
				$state.go('portal.aboutcategory');
			} else if (sel === 'AllApplications') {
				$state.go('portal.applications');
			} else if (sel === 'AllPolicies') {
				$state.go('portal.policies');
			} else if (sel === 'Contacts') {
				$state.go('portal.contact');
			} else if (sel == 'FAQs') {
				$state.go('portal.faqs');
			} else if (sel == 'Groups') {
				$state.go('portal.groups');
			}
		}
	}

	angular.module("app").controller("AppCtrl", ['$scope', '$http', '$window', 'toastr', 'authService', '$timeout', AppCtrl]);
	function AppCtrl($scope, $http, $window, toastr, authService, $timeout) {
		//....
	}
	angular.module("app").controller("GoogleAnalyticsCtrl", ['$scope', 'storageService', 'toastr', 'authService', '$window', '$rootScope', '$state', 'appSetting', GoogleAnalyticsCtrl]);
	function GoogleAnalyticsCtrl($scope, storageService, toastr, authService, $window, $rootScope, $state, appSetting) {
		var ctrl = this;
		ctrl.canViewGoogleAnalytics = false;
		ctrl.canViewGoogleAnalytics = authService.isGranted('view_google_analytics');
	}
	angular.module("app").controller("LayoutCtrl", ['$scope', 'storageService', 'toastr', 'authService', '$window', '$rootScope', '$state', 'appSetting', LayoutCtrl]);
	function LayoutCtrl($scope, storageService, toastr, authService, $window, $rootScope, $state, appSetting) {
		var ctrl = this;
		ctrl.permissions = '';
		ctrl.hos = appSetting.documentBaseURL;

		if (!authService.isAuthenticated()) {
			$window.location.href = appSetting.hostUrl + '/login';
		}
		ctrl.selectedMenu = 'Dashboard';

		ctrl.canViewAbout = false;
		ctrl.canViewCategoryApplications = false;
		ctrl.canViewApplications = false;
		ctrl.viewCategoryNews = false;
		ctrl.viewNews = false;
		ctrl.canViewCategoryPolicy = false;
		ctrl.canViewPolicy = false;
		ctrl.canViewCategoryDownload = false;
		ctrl.canViewDownload = false;
		ctrl.canViewCategoryDownload = false;
		ctrl.canViewDownload = false;
		ctrl.canViewContactList = false;
		ctrl.canViewFaqs = false;
		ctrl.canViewUserGroup = false;
		ctrl.canViewAdminUser = false;
		ctrl.canViewFrontendUser = false;

		ctrl.canViewActivityLog = false;
		ctrl.canViewUsageLog = false;
		ctrl.canViewGoogleAnalytics = false;
		ctrl.loading = true;
		ctrl.canViewDefualtCoverImage=true;
		ctrl.canModeifyDefaultCoverImage=true;
		authService.getUserInfo().then(function (result) {
			ctrl.profile = result;

			authService.getUserPermissions().then(function (r) {

				storageService.setData('permission', r);
				ctrl.loading = false;
				ctrl.canViewAbout = true;//authService.isGranted('view_about');
				ctrl.canViewCategoryApplications = authService.isGranted('view_category_applications');
				ctrl.canViewApplications = authService.isGranted('view_applications');
				ctrl.viewCategoryNews = authService.isGranted('view_category_news');
				ctrl.viewNews = authService.isGranted('view_news');
				ctrl.canViewCategoryPolicy = authService.isGranted('view_category_policy');
				ctrl.canViewPolicy = authService.isGranted('view_policy');
				ctrl.canViewCategoryDownload = authService.isGranted('view_category_download');
				ctrl.canViewDownload = authService.isGranted('view_download');
				ctrl.canViewContactList = authService.isGranted('view_contactlist');
				ctrl.canViewFaqs = authService.isGranted('view_faqs');

				ctrl.canViewUserGroup = authService.isGranted('view_usergroup');
				ctrl.canViewAdminUser = authService.isGranted('view_adminuser');
				ctrl.canViewFrontendUser = authService.isGranted('view_frontenduser');

				ctrl.canViewActivityLog = authService.isGranted('view_activity_log');
				ctrl.canViewUsageLog = authService.isGranted('view_usage_log');

				ctrl.canviewCategoryDashboard = authService.isGranted("view_category_dashboard");
				ctrl.canViewDashboardConfig = authService.isGranted("view_dashboard_config");
				ctrl.canViewMonitorTableau = authService.isGranted("view_monitor_tableau");
				ctrl.canViewMonitorEmail = authService.isGranted("view_monitor_email");
				ctrl.canViewCorperate = authService.isGranted("view_corperate");
				ctrl.canViewGoogleAnalytics = authService.isGranted('view_google_analytics');
			});

		}, function (err) {
			ctrl.loading = false;
		});

		ctrl.Logout = function () {
			var url = appSetting.hostUrl + '/login';
			authService.clearCredential();
			$window.location.href = url;
		}
		//tesst test
		ctrl.goto = function (sel) {
			ctrl.selectedMenu = sel;
			if (sel === 'Dashboard') {
				$state.go('portal.dashboard');
			} else if (sel === 'NewsCategory') {
				$state.go('portal.newscategory');
			} else if (sel === 'AllNews') {
				$state.go('portal.news');
			} else if (sel === 'DownloadCategory') {
				$state.go('portal.downloadcategory');
			} else if (sel === 'DashbaordReportCategory') {
				$state.go('portal.dashboardReportCategory');
			} else if (sel === "DasboardMonitor") {
				$state.go('portal.dashboardMonitor');
			} else if (sel === 'AllDashbaordReport') {
				$state.go('portal.allDashboardReport');
			} else if (sel === 'AddDashboardReport') {
				$state.go('portal.addDashboardReport');
			}
			else if (sel === 'AllDownload') {
				$state.go('portal.download');
			} else if (sel === 'AboutCategory') {
				$state.go('portal.aboutcategory');
			} else if (sel === 'AppCategory') {
				$state.go('portal.appcategory');
			} else if (sel === 'PolicyCategory') {
				$state.go('portal.policycategory');
			} else if (sel === 'AllApplicsations') {
				$state.go('portal.applications');
			} else if (sel === 'AllPolicies') {
				$state.go('portal.policies');
			} else if (sel === 'Contacts') {
				$state.go('portal.contact');
			} else if (sel == 'FAQs') {
				$state.go('portal.faqs');
			} else if (sel == 'Groups') {
				$state.go('portal.groups');
			} else if (sel == 'AdminUsers') {
				$state.go('portal.adminusers');
			} else if (sel == 'FrontEndUsers') {
				$state.go('portal.frontusers');
			} else if (sel == 'ActivityLog') {
				$state.go('portal.activitylog');
			} else if (sel == 'UsageLog') {
				$state.go('portal.usagelog');
			} else if (sel == "MonitorTableau") {
				$state.go('portal.monitorTableau');
			} else if (sel == "MonitorEmail") {
				$state.go('portal.monitorEmail');
			} else if (sel == 'CorperateList') {
				$state.go('portal.corperateList');
			} else if (sel == "GoogleAnalytics") {
				$state.go('portal.googleAnalytics')
			}else if (sel=='CoverImage'){
				$state.go('portal.coverImage')
			}else if(sel=='DefaultCover'){
				$state.go('portal.defaultCover');
			}
		}
	}

	angular.module("app").controller("LoginCtrl", ['$scope', '$http', '$location', '$window', '$timeout', 'authService', 'storageService', '$state', '$cookies', 'toastr', 'appSetting', LoginCtrl]);
	function LoginCtrl($scope, $http, $location, $window, $timeout, authService, storageService, $state, $cookies, toastr, appSetting) {

		if (authService.isAuthenticated()) {
			$window.location.href = appSetting.hostUrl + '/portal/dashboard';
		}

		var ctrl = this;
		ctrl.username = null;
		ctrl.password = null;

		angular.element('#username').focus();

		// check with window authentication
		// authService.winauthenicate().then(function(result){
		// 	authService.initToken(result.token);
		// 	$cookies.put('token', result.token);
		// 	$location.url('/portal/dashboard');

		// }, function (err) {});

		ctrl.processing = false;
		ctrl.login = function (valid) {

			angular.forEach($scope.frmLogin.$error.required, function (field) {
				field.$setDirty();
			});

			if (valid) {
				ctrl.processing = true;

				authService.authenticate(ctrl.username, ctrl.password).then(function (result) {
					//console.log('result.token', result.token);
					//$cookies.put('token', result.token);
					storageService.setVal('token', result.token);
					authService.initToken(result.token);

					authService.getUserPermissions().then(function (r) {
						storageService.setData('permission', r);
						$location.url('/portal/dashboard');
					});

				}, function (err) {
					ctrl.password = null;
					ctrl.processing = false;
					angular.element('#password').focus();

					console.log(err);
					toastr.error('Username or password is incorrect or Inactive!', 'Error');
					// if (err.data)
					// 	toastr.error(err.data.MessageDetail, 'Error');
					// else
					// 	toastr.error(err.Message, 'Error');
				});
			}
		}
	}

	angular.module("app").controller("NewsCtrl", ['$scope', '$http', '$window', 'toastr', 'authService', 'newsService', '$state', '$timeout', '$uibModal', NewsCtrl]);
	function NewsCtrl($scope, $http, $window, toastr, authService, newsService, $state, $timeout, $uibModal) {
		var ctrl = this;

		ctrl.permissions = [];
		ctrl.categories = [];
		ctrl.status = ['All', 'Active', 'Inactive'];
		ctrl.pageSizes = [20, 50, 100, 200];
		ctrl.totalPage = 0;
		ctrl.priorities = [];
		ctrl.criteria = {
			topic: '',
			dateFrom: null,
			dateTo: null,
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

		ctrl.canViewNews = false;
		ctrl.canEditNews = false;
		ctrl.canViewNews = authService.isGranted('view_news');
		ctrl.canEditNews = authService.isGranted('modify_news');

		ctrl.getNewsSearchCriteria = function () {
			newsService.getNewsSearchCriteria().then(function (r) {
				console.log(r);
				ctrl.permissions = r.permissions;
				ctrl.categories = r.categories;
				ctrl.criteria.selectedCategory = ctrl.categories[0];
				ctrl.criteria.selectedPermission = ctrl.permissions[0];
				ctrl.searchNews();
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

			ctrl.searchNews(true);
		};

		ctrl.searchNews = function (isClickSearch) {
			$('#searchresult').block({
				message: loading,
				css: { border: '0px', backgroundColor: 'none', fontSize: '0.4em' }
			});
			if (isClickSearch) {
				ctrl.criteria.pageNumber = 1;
				ctrl.criteria.pageSize = ctrl.pageSizes[0];
			}
			newsService.searchNews(ctrl.criteria).then(function (r) {
				$('#searchresult').unblock();
				ctrl.criteria.total = r.total;
				ctrl.criteria.results = r.news;
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
				topic: '',
				dateFrom: null,
				dateTo: null,
				selectedCategory: ctrl.categories[0],
				selectedPermission: ctrl.permissions[0],
				selectedStatus: ctrl.status[0],
				pageNumber: 1,
				pageSize: ctrl.pageSizes[0],
				sortingOrder: 'n.[Priority]',
				reverse: false,
				total: 0
			}
			ctrl.searchNews();
		}
		ctrl.previousPage = function () {
			if (ctrl.criteria.pageNumber > 1 && ctrl.totalPage > 1) {
				ctrl.criteria.pageNumber = ctrl.criteria.pageNumber - 1;
				ctrl.searchNews();
			}
		}
		ctrl.nextPage = function () {
			if (ctrl.criteria.pageNumber >= 1 && (ctrl.criteria.pageNumber < ctrl.totalPage)) {
				ctrl.criteria.pageNumber = ctrl.criteria.pageNumber + 1;
				ctrl.searchNews();
			}
		}
		ctrl.changePageSize = function () {
			ctrl.criteria.pageNumber = 1;
			ctrl.searchNews();
		}
		ctrl.updateNewsPriority = function (id, priority) {
			newsService.updateNewsPriority(id, priority).then(function (r) {
				ctrl.searchNews();
				toastr.success("บันทึกสำเร็จ");
			}, function (err) {
				toastr.error(err.statusText, 'Error');
			});
		}
		ctrl.updateStatus = function (r) {

			$('#searchresult').block({
				message: loading,
				css: { border: '0px', backgroundColor: 'none', fontSize: '0.4em' }
			});
			newsService.updateNewsStatus({
				id: r.id,
				status: r.status == 'Active'
			}).then(function (r) {
				toastr.success("บันทึกสำเร็จ");
				ctrl.searchNews();
			}, function (err) {
				ctrl.processing = false;
				toastr.error(err.statusText, 'Error');
				$('#searchresult').unblock();
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
		ctrl.deleteNews = function () {

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
						newsService.deleteNews(deletedIds).then(function (r) {
							ctrl.processing = false;
							toastr.success("ลบรายการสำเร็จ");
							ctrl.searchNews();
						}, function (err) {
							ctrl.processing = false;
							toastr.error(err.statusText, 'Error');
						});
					}
				}
			});

		}


		ctrl.goto = function (sel, obj) {
			if (sel === 'Dashboard') {
				$state.go('portal.dashboard');
			} else if (sel === 'AllNews') {
				$state.go('portal.news');
			} else if (sel === 'AddNews') {
				$state.go('portal.editnews', { obj: { mode: 'add', data: null } });
			} else if (sel === 'EditNews') {
				$state.go('portal.editnews', { obj: { mode: 'edit', data: obj } });
			}
		}
		ctrl.preview = function (item) {
			var url = $state.href('preview', { p: item.id, m: 'news' });
			$window.open(url, '_blank');
		}

		// init data
		ctrl.getNewsSearchCriteria();
	}
	// angular.module("app").controller("dashboardReportCtrl", ['$scope', '$http', '$window', 'toastr', 'authService',, 'newsService', '$state', '$stateParams', 'storageService', '$timeout', '$uibModal', 'Upload', 'appSetting', 'mediaService', 'clipboard', dashboardReportCtrl]);
	// function dashboardReportCtrl($scope, $http, $window, toastr, authService,categoryService, dashboardReportService, $state, $stateParams, storageService, $timeout, $uibModal, Upload, appSetting, mediaService, clipboard) {
	angular.module("app").controller("dashboardReportCtrl", ['$scope', '$http', '$window', 'toastr', 'categoryService', 'authService', 'dashboardReportService', '$state', '$stateParams', '$timeout', '$uibModal', 'appSetting', dashboardReportCtrl]);
	function dashboardReportCtrl($scope, $http, $window, toastr, categoryService, authService, dashboardReportService, $state, $stateParams, $timeout, $uibModal, appSetting) {
		var ctrl = this;
		// ctrl.title=""
		ctrl.permissions = [];
		ctrl.categories = [];
		ctrl.status = ['All', 'Active', 'Inactive'];
		ctrl.pageSizes = [20, 50, 100, 200];
		ctrl.totalPage = 0;
		ctrl.priorities = [];
		ctrl.state = "add";
		ctrl.obj = $stateParams.obj;
		ctrl.title = "Add Deshboard Report";
		ctrl.editObj = null;
		ctrl.newModel = null;
		ctrl.submitted = false;
		ctrl.refreshObj = function () {
			ctrl.editObj = {
				Report_Name: "",
				Description: "",
				Tableau_Workbook_Name: "",
				Tableau_Workbook_ID: "",
				Frequency: "",
				Show_On_Highlight: false,
				Permission: "PTT",
				Status: true,
				categoryID: "",
				Send_Report: false,
				Send_Email: false,
				File_Format: "",
				CLevel: false,
				SEVP: false,
				EVP: false,
				VP: false,
				Corperate: false,
				CLevel_Frequency: "",
				SEVP_Frequency: "",
				EVP_Frequency: "",
				VP_Frequency: "",
				Corp_Frequency: "",
				Category_ID: "",
				Dashboard_Type: "",
				Tableau_URL: "",
				Tableau_View_Name: "",
				Tableau_View_ID: ""
			}
			ctrl.newModel = { createdDate: "", updatedDate: "", createdBy: "", updatedBy: "" }
		}
		ctrl.refreshObj();
		if (ctrl.obj) {
			if (ctrl.obj.mode == "edit") {
				ctrl.state = "edit";
				ctrl.title = "Edit Dashbaord Report"
			}
			console.log(ctrl.obj)

			if (ctrl.obj.data != undefined) {
				// ,
				var report_ID = ctrl.obj.data.report_ID;

				$http.get(appSetting.apiBaseUrl + '/api/report/getReportConfigById/' + report_ID, {
					transformRequest: angular.identity,
					headers: {
						'Content-Type': undefined
					}
				}).then(function (r) {
					var { createdDate, updatedDate, createdBy, updatedBy } = r.data;
					// ctrl.tableau_Workbooks=r.data.tableauWorkBook;
					ctrl.editObj = {
						Report_ID: r.data.report_ID,
						Report_Name: r.data.report_Name,
						Description: r.data.description,
						Tableau_Workbook_Name: r.data.tableau_Workbook_Name,
						Tableau_Workbook_ID: r.data.tableau_Workbook_ID,
						Frequency: r.data.frequency,
						Show_On_Highlight: r.data.show_On_Highlight,
						Permission: r.data.permission,
						Status: r.data.status,
						categoryID: "",
						Send_Report: r.data.send_Report,
						Send_Email: r.data.send_Email,
						File_Format: r.data.file_Format,
						CLevel: r.data.cLevel,
						SEVP: r.data.sevp,
						EVP: r.data.evp,
						VP: r.data.vp,
						Corperate: r.data.corperate,
						CLevel_Frequency: r.data.cLevel_Frequency,
						SEVP_Frequency: r.data.sevP_Frequency,
						EVP_Frequency: r.data.evP_Frequency,
						VP_Frequency: r.data.vP_Frequency,
						Corp_Frequency: r.data.corp_Frequency,
						Category_ID: "" + r.data.category_ID,
						Tableau_URL: r.data.tableau_URL,
						Dashboard_Type: r.data.dashboard_Type == null ? "" : r.data.dashboard_Type,
						Tableau_View_Name: r.data.tableau_View_Name,
						Tableau_View_ID: r.data.tableau_View_ID
					}
					for (var key in ctrl.editObj) {
						if (ctrl.editObj[key] == 1) {
							ctrl.editObj[key] = true;
						} else if (ctrl.editObj[key] == 0 && ctrl.editObj[key] != "") {
							ctrl.editObj[key] = false;
						}
					}
					ctrl.change_tableau();

					ctrl.newModel = { createdDate: createdDate, updatedDate: updatedDate, createdBy: createdBy, updatedBy: updatedBy };
					console.log(ctrl.newModel)
				}, function (err) {
					ctrl.processing = false;
					toastr.error(err.statusText, 'Error');
				});

			}

		}

		ctrl.updateStatus = function (r) {
			$('#searchresult').block({
				message: loading,
				css: { border: '0px', backgroundColor: 'none', fontSize: '0.4em' }
			});
			dashboardReportService.updateStatus({
				report_id: r.report_ID,
				status: r.status
			}).then(function (r) {
				toastr.success("บันทึกสำเร็จ");
				ctrl.searchReportConfig();
			}, function (err) {
				ctrl.processing = false; updateStatus
				toastr.error(err.statusText, 'Error');
				$('#searchresult').unblock();
			});
			// console.log(r);

		}

		ctrl.criteria = {
			topic: '',
			selectedStatus: ctrl.status[0],
			pageNumber: 1,
			pageSize: ctrl.pageSizes[0],
			total: 0,
			sortingOrder: 'Priority',
			results: [],
			reverse: "asc"
		}
		ctrl.search_crieria = {
			ReportName: "",
			DashboardReportFlag: "2",
			ShowOnHighlight: "2",
			CategoryID: "",
			Status: "2",
			Permission: "",
			SendEmailFlag: "2",
			Frequency: ""
		}

		ctrl.canView = false;
		ctrl.canEdit = false;
		ctrl.categoryType = null;
		ctrl.canEditCategoryDashboardReport = true;
		console.log(ctrl.canEditCategoryDashboardReport);

		ctrl.canView = authService.isGranted('view_dashboard_config');
		ctrl.canEdit = authService.isGranted("modify_dashboard_config");
		ctrl.tableau_Workbooks = [];
		ctrl.tableau_Workbook = {};
		var fd = new FormData();
		ctrl.SM_report_change = function () {
			if (!ctrl.editObj.Send_Report) {
				ctrl.editObj.Frequency = "";
				ctrl.editObj.Category_ID = "";
			}
		}
		ctrl.Send_email_change = function () {
			if (!ctrl.editObj.Send_Email) {
				ctrl.editObj.CLevel = false,
					ctrl.editObj.SEVP = false,
					ctrl.editObj.EVP = false,
					ctrl.editObj.VP = false,
					ctrl.editObj.Corperate = false,
					ctrl.editObj.CLevel_Frequency = "",
					ctrl.editObj.SEVP_Frequency = "",
					ctrl.editObj.EVP_Frequency = "",
					ctrl.editObj.VP_Frequency = "",
					ctrl.editObj.Corp_Frequency = "",
					ctrl.editObj.Tableau_URL = "";
				ctrl.editObj.File_Format = "";

			} else {
				ctrl.editObj.File_Format = "PDF"
			}
		}
		ctrl.is_selectWeekly = function () {
			return ["Frequency", "CLevel_Frequency", "SEVP_Frequency", "EVP_Frequency", "VP_Frequency", "Corp_Frequency"].filter(function (item) {
				return ctrl.editObj[item] == "Weekly"
			}).length != 0;
		}
		ctrl.frequency_change = function () {
			console.log("change");
			// var check=["Frequency","CLevel_Frequency","SEVP_Frequency","EVP_Frequency","VP_Frequency","Corp_Frequency"].filter(function(item)ctrl.editObj[item]=="Weekly").length==0;
			// if(!check){
			// 	ctrl.editObj.Dashboard_Type='Realtime'
			// }
		}
		ctrl.dashboard_type_change = function () {
			if (ctrl.editObj.dashboard_Type == "Delay") {
				["Frequency", "CLevel_Frequency", "SEVP_Frequency", "EVP_Frequency", "VP_Frequency", "Corp_Frequency"].forEach(function (item) {
					return ctrl.editObj[item] = ctrl.editObj[item] == "Weekly" ? '' : ctrl.editObj[item];
				})

			}
		}
		ctrl.tablueViews = [];
		ctrl.change_tableau = function () {
			var workbook = ctrl.tableau_Workbooks.filter(function (item) {
				return item.tableau_Workbook_ID == ctrl.editObj.Tableau_Workbook_ID;
			});
			if (workbook.length > 0) {
				ctrl.editObj.Tableau_Workbook_Name = workbook[0].tableau_Workbook_Name;

			}
			console.log(ctrl.editObj)
			$http.get(appSetting.apiBaseUrl + '/api/report/getTableauView/' + ctrl.editObj.Tableau_Workbook_ID, {
				transformRequest: angular.identity,
				headers: {
					'Content-Type': undefined
				}
			}).then(function (r) {
				console.log(r);
				ctrl.tablueViews = r.data.tableauView;
				console.log(ctrl.tablueViews)
			}, function (err) {
				ctrl.processing = false;
				toastr.error(err.statusText, 'Error');
			});

		}
		ctrl.change_view = function () {
			// https://pttgwebtest3.pttgrp.com/PTT-SMPortal_test/admin/service/api/report/getTableauView/e871009a-b41a-4e8d-908d-fb818344a38f
			var view = ctrl.tablueViews.filter(function (item) {
				return item.tableau_View_ID == ctrl.editObj.Tableau_View_ID;
			});
			if (view.length > 0) {
				ctrl.editObj.Tableau_View_Name = view[0].tableau_View_Name;

			}

		}
		$http.get(appSetting.apiBaseUrl + '/api/report/getTableauWorkbook', {
			transformRequest: angular.identity,
			headers: {
				'Content-Type': undefined
			}
		}).then(function (r) {
			console.log(r);
			ctrl.tableau_Workbooks = r.data.tableauWorkBook;
			console.log(ctrl.tableau_Workbooks)
		}, function (err) {
			ctrl.processing = false;
			toastr.error(err.statusText, 'Error');
		});
		// alert(2);
		// c
		categoryService.getCategoryTypes().then(function (r) {
			console.log(r);
			angular.forEach(r, function (v, k) {
				if (v.name == 'Dashboard') {
					ctrl.categoryType = v;
					console.log(ctrl.categoryType)
				}
			})
		})
		ctrl.level_change = function (type) {
			if (!ctrl.editObj[type]) {
				if (type == 'Corperate') {
					ctrl.editObj["Corp_Frequency"] = "";
				} else {
					ctrl.editObj[type + "_Frequency"] = "";
				}
			}
		}
		ctrl.saveReportConfig = function () {
			// console.log(1111);
			// ctrl.processing=true;
			ctrl.submitted = true;
			console.log(ctrl.editObj);
			var require = function (x) {
				var y = x.filter(function (item) {
					return ctrl.editObj[item] != ""
				});
				return y.length == x.length;
			}
			var require_check = function (x) {
				var y = x.filter(function (item) {
					if (item == 'Corperate') {
						return ctrl.editObj["Corp_Frequency"] == "" && ctrl.editObj[item];
					} else {
						return ctrl.editObj[item + "_Frequency"] == "" && ctrl.editObj[item];
					}
				});
				return y.length == 0;
			}
			var one_select_require = function (x) {
				return x.filter(function (item) {
					return ctrl.editObj[item].length > 0;
				})
			}
			if (require(["Report_Name", "Tableau_Workbook_ID", "Permission", "Dashboard_Type"])) {
				if (ctrl.editObj.Send_Report && !require(["Category_ID", "Frequency"]));
				if (ctrl.editObj.Send_Email && !require_check(["CLevel", "SEVP", "EVP", "VP", "Corperate"])) {

					return;
				}
				if (ctrl.editObj.Send_Email && (!one_select_require(["CLevel", "SEVP", "EVP", "VP", "Corperate"]))) {
					toastr.error("Please select at least one level for send Email.", 'Error');
					return
				}

				var body = JSON.parse(JSON.stringify(ctrl.editObj));
				if (body.Category_ID == "") {
					body.Category_ID = 0;
				}
				// alert(JSON.stringify(ctrl.editObj))
				var fd = new FormData();
				// ctrl.editObj.Tableau_Workbook_Name=ctrl.editObj.Tableau_Workbook_ID;
				for (var x in body) {
					if (body[x] === true) {
						body[x] = 1;
					}
					if (ctrl.editObj[x] === false) {
						body[x] = 0;
					}
					console.log(x,body[x])
					fd.append(x, body[x]);
				}
				console.log(body);
				ctrl.processing = true;
				$http.post(appSetting.apiBaseUrl + '/api/report/saveReportConfig', fd, {
					transformRequest: angular.identity,
					headers: {
						'Content-Type': undefined
					}
				}).then(function (r) {
					ctrl.processing = false;
					toastr.success("บันทึกสำเร็จ");


					// ctrl.goto("AllDashboardReport");
					$scope.frmCategory.$setPristine();
					$scope.frmCategory.$setUntouched();

				}, function (err) {
					ctrl.processing = false;
					toastr.error(err.statusText, 'Error');
					// ctrl.goto("AllDashboardReport");
					$scope.frmCategory.$setPristine();
					$scope.frmCategory.$setUntouched();
				});
			} else {
				// alert("required");
				console.log(ctrl.editObj);
			}
		}
		ctrl.saveCategory = function (valid) {
			angular.forEach($scope.frmCategory.$$controls, function (field) {
				field.$setDirty();
				field.$validate();
			});
			if (valid) {
				if (ctrl.state == 'add') {
					ctrl.editObj.id = 0;
					ctrl.editObj.displayLayout = 'LAYOUT_ANNOUNCEMENT';
				}

				var fd = new FormData();
				fd.append('ID', ctrl.editObj.id);
				fd.append('Status', ctrl.editObj.status);
				fd.append('Name', ctrl.editObj.name);
				fd.append('CategoryTypeID', ctrl.categoryType.id);
				fd.append('Icon', ctrl.editObj.icon);
				fd.append('Color', ctrl.editObj.color);
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
		// alert(ctrl.canEdit)
		ctrl.getDashboardReportCriteria = function () {
			dashboardReportService.getDashboardReportCriteria().then(function (r) {

				ctrl.categories = r;
				console.log("category", ctrl.categories);
			}, function (err) {
				if (err.data)
					toastr.error(err.data.MessageDetail, 'Error');
				else
					toastr.error(err.Message, 'Error');
			});
		}

		ctrl.searchReportConfig = function () {
			ctrl.reportConfigs = [];
			$('#searchresult').block({
				message: loading,
				css: { border: '0px', backgrroundColor: 'none', fontSize: '0.4em' }
			});
			var body = JSON.parse(JSON.stringify(ctrl.criteria));
			body.ReportName = ctrl.search_crieria.ReportName;
			body.Permission = ctrl.search_crieria.Permission;
			var checkbool = function (type) {
				type.forEach(function (item) {
					if (ctrl.search_crieria[item] != "2") {
						body[item] = parseInt(ctrl.search_crieria[item]);
					}
				})
			}

			checkbool(["DashboardReportFlag", "ShowOnHighlight", "Status", "SendEmailFlag"]);
			if (ctrl.search_crieria.CategoryID != "") {
				body.CategoryID = parseInt(ctrl.search_crieria.CategoryID);
			}
			console.log(body);
			dashboardReportService.searchReportConfig(body).then(function (result) {
				ctrl.reportConfigs = result.reportConfigs.map(function (item) {
					for (var key in item) {
						if (item[key] == 'null' || item[key] == null) {
							item[key] = "";
						}
					}
					item.selected = false;
					item.priority += '';
					item.highlight_Priority += '';
					item.status += '';
					return item;
				});
				ctrl.criteria.total = result.total;
				// ctrl.criteria.results = r.policies;
				let x = Math.floor(result.total / ctrl.criteria.pageSize);
				if ((result.total % ctrl.criteria.pageSize) >= 1)
					x = x + 1;

				ctrl.totalPage = x;
				console.log(ctrl.criteria.total);
				$('#searchresult').unblock();
			}, function (err) {
				if (err.data)
					toastr.error(err.data.MessageDetail, 'Error');
				else
					toastr.error(err.message, 'Error');
			})
		}
		ctrl.searchReportConfig();
		// chang sorting order
		ctrl.sort_by = function (newSortingOrder) {
			if (ctrl.criteria.sortingOrder == newSortingOrder)
				ctrl.criteria.reverse = ctrl.criteria.reverse == 'asc' ? 'desc' : 'asc';

			ctrl.criteria.sortingOrder = newSortingOrder;

			ctrl.searchReportConfig();
		};

		ctrl.searchNews = function (isClickSearch) {
			$('#searchresult').block({
				message: loading,
				css: { border: '0px', backgrroundColor: 'none', fontSize: '0.4em' }
			});
			if (isClickSearch) {
				ctrl.criteria.pageNumber = 1;
				ctrl.criteria.pageSize = ctrl.pageSizes[0];
			}
			newsService.searchNews(ctrl.criteria).then(function (r) {
				$('#searchresult').unblock();
				ctrl.criteria.total = r.total;
				ctrl.criteria.results = r.news;
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
			ctrl.search_crieria = {
				ReportName: "",
				DashboardReportFlag: "2",
				ShowOnHighlight: "2",
				CategoryID: "",
				Status: "2",
				Permission: "",
				SendEmailFlag: "2",
				Frequency: ""
			}
			ctrl.searchReportConfig();
		}
		ctrl.delete_report = function () {
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
					console.log(ctrl.reportConfigs);
					ctrl.processing = true;
					let deleteIDs = ctrl.reportConfigs.filter(function (item) {
						return item.selected;
					}).map(function (item) {
						return item.report_ID;
					});
					console.log(deleteIDs);
					if (deleteIDs.length > 0) {
						dashboardReportService.deleteReport({ ReportConfigIds: deleteIDs }).then(function (result) {
							toastr.success("ลบรายการสำเร็จ");
							ctrl.processing = false;
							ctrl.searchReportConfig();
						}, function (err) {
							ctrl.processing = false;
							toastr.error(err.statusText, 'Error');
						})
					}
				}
			});
		}
		ctrl.previousPage = function () {
			if (ctrl.criteria.pageNumber > 1 && ctrl.totalPage > 1) {
				ctrl.criteria.pageNumber = ctrl.criteria.pageNumber - 1;
				ctrl.searchReportConfig();
			}
		}
		ctrl.nextPage = function () {
			if (ctrl.criteria.pageNumber >= 1 && (ctrl.criteria.pageNumber < ctrl.totalPage)) {
				ctrl.criteria.pageNumber = ctrl.criteria.pageNumber + 1;
				ctrl.searchReportConfig();
			}
		}
		ctrl.changePageSize = function () {
			ctrl.criteria.pageNumber = 1;
			ctrl.searchReportConfig();
		}
		ctrl.updateReportPriority = function (item, priority) {
			// alert(priority)
			// console.log(e);
			item.priority = priority;
			console.log(item);
			var data = { report_ID: item.report_ID, priority: parseInt(priority), category_ID: item.category_ID };
			var fd = new FormData();
			for (var key in data) {
				fd.append(key, data[key]);
			}
			$http.post(appSetting.apiBaseUrl + '/api/report/updateReportConfigPriority', fd, {
				transformRequest: angular.identity,
				headers: {
					'Content-Type': undefined
				}
			}).then(function (r) {
				toastr.success("บันทึกสำเร็จ");
				ctrl.processing = false;

				ctrl.searchReportConfig();
				// $scope.frmCategory.$setPristine();
				// $scope.frmCategory.$setUntouched();
				// ctrl.loadCategories();
			}, function (err) {
				ctrl.processing = false;
				toastr.error(err.statusText, 'Error');
			});
			// $http({
			// 	method: 'POST',
			// 	url: appSetting.apiBaseUrl + '/api/report/updateReportConfigPriority',
			// 	data:fd
			// }).then(function successCallback(response) {
			// 		toastr.success("บันทึกรายการสำเร็จ");
			// 	ctrl.searchReportConfig();
			// }, function errorCallback(response) {
			// 	toastr.error(err.statusText + ':'+ err.data, 'Error');
			// });
			// dashboardReportService.updateReportPriority({report_ID:item.report_ID,priority:priority,category_ID:item.category_ID}).then(function(r){
			// 	toastr.success("บันทึกรายการสำเร็จ");
			// 	ctrl.searchReportConfig();
			// 	// ctrl.loadCategories();
			// }, function (err) {
			// 	toastr.error(err.statusText + ':'+ err.data, 'Error');
			// });
		}
		ctrl.updateHighlight = function (item, highlight) {
			// alert(priority)
			// console.log(e);
			item.highlight = highlight;
			console.log(item);
			var data = { report_ID: item.report_ID, Highlight_Priority: parseInt(highlight), category_ID: item.category_ID };
			var fd = new FormData();
			for (var key in data) {
				fd.append(key, data[key]);
			}
			$http.post(appSetting.apiBaseUrl + '/api/report/updateHighlightPriority', fd, {
				transformRequest: angular.identity,
				headers: {
					'Content-Type': undefined
				}
			}).then(function (r) {
				toastr.success("บันทึกสำเร็จ");
				ctrl.processing = false;

				ctrl.searchReportConfig();
				// $scope.frmCategory.$setPristine();
				// $scope.frmCategory.$setUntouched();
				// ctrl.loadCategories();
			}, function (err) {
				ctrl.processing = false;
				toastr.error(err.statusText, 'Error');
			});
			// $http({
			// 	method: 'POST',
			// 	url: appSetting.apiBaseUrl + '/api/report/updateReportConfigPriority',
			// 	data:fd
			// }).then(function successCallback(response) {
			// 		toastr.success("บันทึกรายการสำเร็จ");
			// 	ctrl.searchReportConfig();
			// }, function errorCallback(response) {
			// 	toastr.error(err.statusText + ':'+ err.data, 'Error');
			// });
			// dashboardReportService.updateReportPriority({report_ID:item.report_ID,priority:priority,category_ID:item.category_ID}).then(function(r){
			// 	toastr.success("บันทึกรายการสำเร็จ");
			// 	ctrl.searchReportConfig();
			// 	// ctrl.loadCategories();
			// }, function (err) {
			// 	toastr.error(err.statusText + ':'+ err.data, 'Error');
			// });
		}

		ctrl.updateNewsStatus = function (id, status) {
			newsService.updateNewsStatus(id, status).then(function (r) {
				toastr.success("บันทึกสำเร็จ");
				ctrl.searchNews();
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
			angular.forEach(ctrl.reportConfigs, function (itm) { itm.selected = toggleStatus; });
		}
		ctrl.optionToggled = function () {
			ctrl.isAllSelected = ctrl.reportConfigs.every(function (itm) {
				return itm.selected;
			})
			let sel = false;
			angular.forEach(ctrl.reportConfigs, function (value, key) {
				if (value.selected) {
					sel = true;
				}
			});
			if (sel)
				ctrl.showDelete = true;
			else
				ctrl.showDelete = false;
		}
		ctrl.deleteNews = function () {

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
						newsService.deleteNews(deletedIds).then(function (r) {
							ctrl.processing = false;
							toastr.success("ลบรายการสำเร็จ");
							ctrl.searchNews();
						}, function (err) {
							ctrl.processing = false;
							toastr.error(err.statusText, 'Error');
						});
					}
				}
			});

		}


		ctrl.goto = function (sel, obj) {
			if (sel === 'Dashboard') {
				$state.go('portal.dashboard');
			} else if (sel === 'AllNews') {
				$state.go('portal.news');
			} else if (sel === 'AddNews') {
				$state.go('portal.editnews', { obj: { mode: 'add', data: null } });
			} else if (sel === 'EditNews') {
				$state.go('portal.editnews', { obj: { mode: 'edit', data: obj } });
			} else if (sel === "AddDashboardReport") {
				ctrl.title = "Add Dashboard Report";
				ctrl.state = "add";
				$state.go('portal.addDashboardReport', { obj: { mode: 'add', data: null } });
			} else if (sel === "EditDashboardReport") {
				ctrl.title = "Edit Dashboard Report";
				ctrl.state = "edit";
				ctrl.editObj = obj;
				// alert(1);
				$state.go('portal.editDashboardReport', { obj: { mode: 'edit', data: obj } });
			} else if (sel === 'AllDashboardReport') {
				$state.go('portal.allDashboardReport');
			}
		}
		ctrl.preview = function (item) {
			var url = $state.href('preview', { p: item.id, m: 'news' });
			$window.open(url, '_blank');
		}

		// init data
		ctrl.getDashboardReportCriteria();
	}
	angular.module("app").controller("monitorLog", ['$scope', '$http', '$window', 'toastr', 'categoryService', 'authService', 'monitorLogService', '$state', '$timeout', '$uibModal', 'appSetting', monitorLog]);
	function monitorLog($scope, $http, $window, toastr, categoryService, authService, monitorLogService, $state, $timeout, $uibModal, appSetting) {
		var ctrl = this;
		// ctrl.title=""
		// alert(2);
		ctrl.permissions = [];
		ctrl.categories = [];
		ctrl.status = ['All', 'Active', 'Inactive'];
		ctrl.pageSizes = [20, 50, 100, 200];
		ctrl.totalPage = 0;
		ctrl.priorities = [];
		ctrl.state = "add";
		ctrl.criteria = {
			pageNumber: 1,
			pageSize: ctrl.pageSizes[0],
			total: 0,
			sortingOrder: 'Report_Name',
			reverse: 'asc',
			ReportName: "",
			LogType: "",
			Frequeuncy: "",
			startDate: "",
			Display_Level: "",
			endDate: "",
			Status: "",
			results: []
		}

		ctrl.canView = false;
		ctrl.canEdit = false;
		ctrl.categoryType = null;
		ctrl.canEditCategoryDashboardReport = true;
		console.log(ctrl.canEditCategoryDashboardReport);
		ctrl.canView = authService.isGranted('view_monitor_tableau');
		categoryService.getCategoryTypes().then(function (r) {
			console.log(r);
			angular.forEach(r, function (v, k) {
				if (v.name == 'Dashboard') {
					ctrl.categoryType = v;
					console.log(ctrl.categoryType)
				}
			})
		})
		ctrl.reportQueues = [];
		function format(date) {
			date = new Date(date);

			var day = date.getDate(), month = date.getMonth() + 1, year = date.getFullYear();
			return (day >= 10 ? day : '0' + day) + '/' + (month >= 10 ? month : '0' + month) + '/' + year;

		}
		ctrl.SearchReportQueues = function () {
			$('#searchresult').block({
				message: loading,
				css: { border: '0px', backgrroundColor: 'none', fontSize: '0.4em' }
			});
			monitorLogService.SearchReportQueues(ctrl.criteria).then(function (result) {
				ctrl.reportQueues = result.reportQueues.map(function (item) {
					item.dueDate_show = item.dueDate;
					item.dueDate = format(item.dueDate);

					return item;
				});
				ctrl.criteria.total = result.total;
				// ctrl.criteria.results = r.policies;
				let x = Math.floor(result.total / ctrl.criteria.pageSize);
				if ((result.total % ctrl.criteria.pageSize) >= 1)
					x = x + 1;

				ctrl.totalPage = x;
				$('#searchresult').unblock();
			})
		}
		ctrl.SearchReportQueues();
		// alert(ctrl.canEdit)


		// chang sorting order
		ctrl.sort_by = function (newSortingOrder) {
			if (ctrl.criteria.sortingOrder == newSortingOrder)
				ctrl.criteria.reverse = ctrl.criteria.reverse == 'asc' ? 'desc' : 'asc';

			ctrl.criteria.sortingOrder = newSortingOrder;

			ctrl.SearchReportQueues();
		};


		ctrl.clearSearch = function () {
			ctrl.criteria = {
				pageNumber: 1,
				pageSize: ctrl.pageSizes[0],
				total: 0,
				sortingOrder: 'Report_Name',
				reverse: 'asc',
				ReportName: "",
				LogType: "",
				Frequeuncy: "",
				Display_Level: "",
				startDate: "",
				endDate: "",
				Status: "",
				results: []
			}
			ctrl.SearchReportQueues();
		}
		ctrl.previousPage = function () {
			if (ctrl.criteria.pageNumber > 1 && ctrl.totalPage > 1) {
				ctrl.criteria.pageNumber = ctrl.criteria.pageNumber - 1;
				ctrl.SearchReportQueues();
			}
		}
		ctrl.nextPage = function () {
			if (ctrl.criteria.pageNumber >= 1 && (ctrl.criteria.pageNumber < ctrl.totalPage)) {
				ctrl.criteria.pageNumber = ctrl.criteria.pageNumber + 1;
				ctrl.SearchReportQueues();
			}
		}
		ctrl.changePageSize = function () {
			ctrl.criteria.pageNumber = 1;
			ctrl.SearchReportQueues();
		}
		ctrl.updateNewsPriority = function (id, priority) {
			newsService.updateNewsPriority(id, priority).then(function (r) {
				ctrl.searchNews();
				toastr.success("บันทึกสำเร็จ");
			}, function (err) {
				toastr.error(err.statusText, 'Error');
			});
		}
		ctrl.updateNewsStatus = function (id, status) {
			newsService.updateNewsStatus(id, status).then(function (r) {
				toastr.success("บันทึกสำเร็จ");
				ctrl.searchNews();
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



		ctrl.goto = function (sel, obj) {
			// alert("MonitorTableau");
			if (sel === 'Dashboard') {
				$state.go('portal.dashboard');
			} else if (sel === 'AllNews') {
				$state.go('portal.news');
			} else if (sel === 'AddNews') {
				$state.go('portal.editnews', { obj: { mode: 'add', data: null } });
			} else if (sel === 'EditNews') {
				$state.go('portal.editnews', { obj: { mode: 'edit', data: obj } });
			} else if (sel === "AddDashboardReport") {
				ctrl.title = "Add Dashboard Report";
				ctrl.state = "add";
				$state.go('portal.addDashboardReport', { obj: { mode: 'add', data: null } });
			} else if (sel === "EditDashboardReport") {
				ctrl.title = "Edit Dashboard Report";
				ctrl.state = "edit";
				this.editObj = obj;
				$state.go('portal.addDashboardReport', { obj: { mode: 'edit', data: obj } });
			} else if (sel === "TablueDetail") {
				$state.go('portal.tablueDetail', { obj: { mode: 'edit', data: obj } });
			} else if (sel == "MonitorTableau") {
				// alert(11);
				$state.go('portal.monitorTableau');
			}
		}
		ctrl.preview = function (item) {
			var url = $state.href('preview', { p: item.id, m: 'news' });
			$window.open(url, '_blank');
		}
		ctrl.reprocess = function (item) {
			$('#searchresult').block({
				message: loading,
				css: { border: '0px', backgrroundColor: 'none', fontSize: '0.4em' }
			});
			var fd = new FormData();
			fd.append("id", item.id)

			$http.post(appSetting.apiBaseUrl + '/api/report/reSyncReportTableau', fd, {
				transformRequest: angular.identity,
				headers: {
					'Content-Type': undefined
				}
			}).then(function (r) {
				// console.log(r.data);
				$("#searchresult").unblock();
				ctrl.SearchReportQueues();
			}, function (err) {
				ctrl.processing = false;
				toastr.error(err.statusText, 'Error');
			});
			// alert(1);

			// item={};

		}
		// init data

	}

	angular.module("app").controller("batchCtrl", ['$scope', '$http', '$window', 'toastr', 'batchService', 'authService', 'monitorLogService', '$state', '$timeout', '$uibModal', 'appSetting', batchCtrl]);
	function batchCtrl($scope, $http, $window, toastr, batchService, authService, monitorLogService, $state, $timeout, $uibModal, appSetting) {
		var ctrl = this;
		// ctrl.title=""
		// alert(2);
		
		ctrl.canView = true;
		ctrl.canEdit = true;
		ctrl.batchjobs=[];
		ctrl.batchService = function () {
			$('#searchresult').block({
				message: loading,
				css: { border: '0px', backgrroundColor: 'none', fontSize: '0.4em' }
			});
			batchService.searchBatch().then(function (result) {
				ctrl.batchjobs = result;
				$('#searchresult').unblock();
			})
		}
	

		ctrl.runBatch = function (batch_path) {
			batchService.runBatch(batch_path).then(function (r) {
				toastr.success("batch running success");
				ctrl.batchService();
			}, function (err) {
				toastr.error(err.statusText, 'Error');
			});
		}
		ctrl.batchService();

	}
	angular.module("app").controller("monitorLog", ['$scope', '$http', '$window', 'toastr', 'categoryService', 'authService', 'monitorLogService', '$state', '$timeout', '$uibModal', 'appSetting', monitorLog]);
	function monitorLog($scope, $http, $window, toastr, categoryService, authService, monitorLogService, $state, $timeout, $uibModal, appSetting) {
		var ctrl = this;
		// ctrl.title=""
		// alert(2);
		ctrl.permissions = [];
		ctrl.categories = [];
		ctrl.status = ['All', 'Active', 'Inactive'];
		ctrl.pageSizes = [20, 50, 100, 200];
		ctrl.totalPage = 0;
		ctrl.priorities = [];
		ctrl.state = "add";
		ctrl.criteria = {
			pageNumber: 1,
			pageSize: ctrl.pageSizes[0],
			total: 0,
			sortingOrder: 'Report_Name',
			reverse: 'asc',
			ReportName: "",
			LogType: "",
			Frequeuncy: "",
			startDate: "",
			Display_Level: "",
			endDate: "",
			Status: "",
			results: []
		}

		ctrl.canView = false;
		ctrl.canEdit = false;
		ctrl.categoryType = null;
		ctrl.canEditCategoryDashboardReport = true;
		console.log(ctrl.canEditCategoryDashboardReport);
		ctrl.canView = authService.isGranted('view_dashboard_report');
		ctrl.canEdit = authService.isGranted('edit_dashboard_report');
		categoryService.getCategoryTypes().then(function (r) {
			console.log(r);
			angular.forEach(r, function (v, k) {
				if (v.name == 'Dashboard') {
					ctrl.categoryType = v;
					console.log(ctrl.categoryType)
				}
			})
		})
		ctrl.reportQueues = [];
		function format(date) {
			date = new Date(date);

			var day = date.getDate(), month = date.getMonth() + 1, year = date.getFullYear();
			return (day >= 10 ? day : '0' + day) + '/' + (month >= 10 ? month : '0' + month) + '/' + year;

		}
		ctrl.SearchReportQueues = function () {
			$('#searchresult').block({
				message: loading,
				css: { border: '0px', backgrroundColor: 'none', fontSize: '0.4em' }
			});
			monitorLogService.SearchReportQueues(ctrl.criteria).then(function (result) {
				ctrl.reportQueues = result.reportQueues.map(function (item) {
					item.dueDate_show = item.dueDate;
					item.dueDate = format(item.dueDate);

					return item;
				});
				ctrl.criteria.total = result.total;
				// ctrl.criteria.results = r.policies;
				let x = Math.floor(result.total / ctrl.criteria.pageSize);
				if ((result.total % ctrl.criteria.pageSize) >= 1)
					x = x + 1;

				ctrl.totalPage = x;
				$('#searchresult').unblock();
			})
		}
		ctrl.SearchReportQueues();
		// alert(ctrl.canEdit)


		// chang sorting order
		ctrl.sort_by = function (newSortingOrder) {
			if (ctrl.criteria.sortingOrder == newSortingOrder)
				ctrl.criteria.reverse = ctrl.criteria.reverse == 'asc' ? 'desc' : 'asc';

			ctrl.criteria.sortingOrder = newSortingOrder;

			ctrl.SearchReportQueues();
		};


		ctrl.clearSearch = function () {
			ctrl.criteria = {
				pageNumber: 1,
				pageSize: ctrl.pageSizes[0],
				total: 0,
				sortingOrder: 'Report_Name',
				reverse: 'asc',
				ReportName: "",
				LogType: "",
				Frequeuncy: "",
				Display_Level: "",
				startDate: "",
				endDate: "",
				Status: "",
				results: []
			}
			ctrl.SearchReportQueues();
		}
		ctrl.previousPage = function () {
			if (ctrl.criteria.pageNumber > 1 && ctrl.totalPage > 1) {
				ctrl.criteria.pageNumber = ctrl.criteria.pageNumber - 1;
				ctrl.SearchReportQueues();
			}
		}
		ctrl.nextPage = function () {
			if (ctrl.criteria.pageNumber >= 1 && (ctrl.criteria.pageNumber < ctrl.totalPage)) {
				ctrl.criteria.pageNumber = ctrl.criteria.pageNumber + 1;
				ctrl.SearchReportQueues();
			}
		}
		ctrl.changePageSize = function () {
			ctrl.criteria.pageNumber = 1;
			ctrl.SearchReportQueues();
		}
		ctrl.updateNewsPriority = function (id, priority) {
			newsService.updateNewsPriority(id, priority).then(function (r) {
				ctrl.searchNews();
				toastr.success("บันทึกสำเร็จ");
			}, function (err) {
				toastr.error(err.statusText, 'Error');
			});
		}
		ctrl.updateNewsStatus = function (id, status) {
			newsService.updateNewsStatus(id, status).then(function (r) {
				toastr.success("บันทึกสำเร็จ");
				ctrl.searchNews();
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



		ctrl.goto = function (sel, obj) {
			// alert("MonitorTableau");
			if (sel === 'Dashboard') {
				$state.go('portal.dashboard');
			} else if (sel === 'AllNews') {
				$state.go('portal.news');
			} else if (sel === 'AddNews') {
				$state.go('portal.editnews', { obj: { mode: 'add', data: null } });
			} else if (sel === 'EditNews') {
				$state.go('portal.editnews', { obj: { mode: 'edit', data: obj } });
			} else if (sel === "AddDashboardReport") {
				ctrl.title = "Add Dashboard Report";
				ctrl.state = "add";
				$state.go('portal.addDashboardReport', { obj: { mode: 'add', data: null } });
			} else if (sel === "EditDashboardReport") {
				ctrl.title = "Edit Dashboard Report";
				ctrl.state = "edit";
				this.editObj = obj;
				$state.go('portal.addDashboardReport', { obj: { mode: 'edit', data: obj } });
			} else if (sel === "TablueDetail") {
				$state.go('portal.tablueDetail', { obj: { mode: 'edit', data: obj } });
			} else if (sel == "MonitorTableau") {
				// alert(11);
				$state.go('portal.monitorTableau');
			}
		}
		ctrl.preview = function (item) {
			var url = $state.href('preview', { p: item.id, m: 'news' });
			$window.open(url, '_blank');
		}
		ctrl.reprocess = function (item) {
			$('#searchresult').block({
				message: loading,
				css: { border: '0px', backgrroundColor: 'none', fontSize: '0.4em' }
			});
			var fd = new FormData();
			fd.append("id", item.id)

			$http.post(appSetting.apiBaseUrl + '/api/report/reSyncReportTableau', fd, {
				transformRequest: angular.identity,
				headers: {
					'Content-Type': undefined
				}
			}).then(function (r) {
				// console.log(r.data);
				$("#searchresult").unblock();
				ctrl.SearchReportQueues();
			}, function (err) {
				ctrl.processing = false;
				toastr.error(err.statusText, 'Error');
			});
			// alert(1);

			// item={};

		}
		// init data

	}
	angular.module("app").controller("tableauDetail", ['$scope', '$http', '$window', 'toastr', 'categoryService', 'authService', 'monitorLogService', '$state', '$stateParams', '$timeout', '$uibModal', 'appSetting', tableauDetail]);
	function tableauDetail($scope, $http, $window, toastr, categoryService, authService, monitorLogService, $state, $stateParams, $timeout, $uibModal, appSetting) {
		var ctrl = this;
		// ctrl.title=""
		ctrl.permissions = [];
		ctrl.categories = [];
		ctrl.status = ['All', 'Active', 'Inactive'];
		ctrl.pageSizes = [20, 50, 100, 200];
		ctrl.totalPage = 0;
		ctrl.priorities = [];
		ctrl.state = "add";
		// alert(1);

		console.log("params", ctrl.params)
		if ($stateParams.obj == null) {
			// alert(1);
			$state.go('portal.monitorTableau');
			return
		}
		ctrl.params = $stateParams.obj;
		ctrl.criteria = {
			pageNumber: 1,
			pageSize: ctrl.pageSizes[0],
			total: 0,
			sortingOrder: 'Report_Name',
			reverse: 'asc',
			ReportID: ctrl.params.data.report_ID,
			DueDate: ctrl.params.data.dueDate,
			Display_Level: ctrl.params.data.display_Level,
			results: []
		}

		ctrl.canView = false;
		ctrl.canEdit = false;
		ctrl.categoryType = null;
		ctrl.canEditCategoryDashboardReport = true;
		console.log(ctrl.canEditCategoryDashboardReport);
		ctrl.canView = authService.isGranted('view_monitor_tableau');
		categoryService.getCategoryTypes().then(function (r) {
			console.log(r);
			angular.forEach(r, function (v, k) {
				if (v.name == 'Dashboard') {
					ctrl.categoryType = v;
					console.log(ctrl.categoryType)
				}
			})
		})
		ctrl.reportQueues = [];
		ctrl.getReportQueueByDue = function () {
			$('#searchresult').block({
				message: loading,
				css: { border: '0px', backgrroundColor: 'none', fontSize: '0.4em' }
			});
			monitorLogService.getReportQueueByDue(ctrl.criteria).then(function (result) {
				ctrl.reportQueues = result.reportQueues;
				ctrl.criteria.total = result.total;
				// ctrl.criteria.results = r.policies;
				$('#searchresult').unblock();
				let x = Math.floor(result.total / ctrl.criteria.pageSize);
				console.log('page', x, ctrl.criteria.pageSize, result.total)
				if ((result.total % ctrl.criteria.pageSize) >= 1)
					x = x + 1;

				ctrl.totalPage = x;
				// console.log(ctrl.totalPage)
			})
		}
		ctrl.getReportQueueByDue();
		// alert(ctrl.canEdit)


		// chang sorting order
		ctrl.sort_by = function (newSortingOrder) {
			if (ctrl.criteria.sortingOrder == newSortingOrder)
				ctrl.criteria.reverse = ctrl.criteria.reverse == 'asc' ? 'desc' : 'asc';

			ctrl.criteria.sortingOrder = newSortingOrder;

			ctrl.getReportQueueByDue();
		};


		ctrl.clearSearch = function () {
			ctrl.criteria = {
				pageNumber: 1,
				pageSize: ctrl.pageSizes[0],
				total: 0,
				sortingOrder: 'Report_Name',
				reverse: 'asc',
				ReportID: ctrl.params.data.report_ID,
				DueDate: ctrl.params.data.dueDate,
				Display_Level: ctrl.params.data.display_Level,
				results: []
			}
			ctrl.SearchReportQueues();
		}
		ctrl.previousPage = function () {
			if (ctrl.criteria.pageNumber > 1 && ctrl.totalPage > 1) {
				ctrl.criteria.pageNumber = ctrl.criteria.pageNumber - 1;
				ctrl.getReportQueueByDue();
			}
		}
		ctrl.nextPage = function () {
			if (ctrl.criteria.pageNumber >= 1 && (ctrl.criteria.pageNumber < ctrl.totalPage)) {
				ctrl.criteria.pageNumber = ctrl.criteria.pageNumber + 1;
				ctrl.getReportQueueByDue();
			}
		}
		ctrl.changePageSize = function () {
			ctrl.criteria.pageNumber = 1;
			ctrl.getReportQueueByDue();
		}
		ctrl.updateNewsPriority = function (id, priority) {
			newsService.updateNewsPriority(id, priority).then(function (r) {
				ctrl.getReportQueueByDue();
				toastr.success("บันทึกสำเร็จ");
			}, function (err) {
				toastr.error(err.statusText, 'Error');
			});
		}
		ctrl.updateNewsStatus = function (id, status) {
			newsService.updateNewsStatus(id, status).then(function (r) {
				toastr.success("บันทึกสำเร็จ");
				ctrl.getReportQueueByDue();
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

		ctrl.reprocess = function (item) {
			$('#searchresult').block({
				message: loading,
				css: { border: '0px', backgrroundColor: 'none', fontSize: '0.4em' }
			});
			var fd = new FormData();
			fd.append("id", item.id);
			$http.post(appSetting.apiBaseUrl + '/api/report/reSyncReportTableau', fd, {
				transformRequest: angular.identity,
				headers: {
					'Content-Type': undefined
				}
			}).then(function (r) {
				// console.log(r.data);
				$("#searchresult").unblock();
				ctrl.getReportQueueByDue();
			}, function (err) {
				ctrl.processing = false;
				toastr.error(err.statusText, 'Error');
			});
			// alert(1);

			// item={};

		}

		ctrl.goto = function (sel, obj) {
			// alert("MonitorTableau");
			if (sel === 'Dashboard') {
				$state.go('portal.dashboard');
			} else if (sel === 'AllNews') {
				$state.go('portal.news');
			} else if (sel === 'AddNews') {
				$state.go('portal.editnews', { obj: { mode: 'add', data: null } });
			} else if (sel === 'EditNews') {
				$state.go('portal.editnews', { obj: { mode: 'edit', data: obj } });
			} else if (sel === "AddDashboardReport") {
				ctrl.title = "Add Dashboard Report";
				ctrl.state = "add";
				$state.go('portal.addDashboardReport', { obj: { mode: 'add', data: null } });
			} else if (sel === "EditDashboardReport") {
				ctrl.title = "Edit Dashboard Report";
				ctrl.state = "edit";
				this.editObj = obj;
				$state.go('portal.addDashboardReport', { obj: { mode: 'edit', data: obj } });
			} else if (sel === "TablueDetail") {
				$state.go('portal.tablueDetail');
			} else if (sel == "MonitorTableau") {
				// alert(11);
				$state.go('portal.monitorTableau');
			}
		}
		ctrl.preview = function (item) {
			var url = $state.href('preview', { p: item.id, m: 'news' });
			$window.open(url, '_blank');
		}

		// init data

	}
	angular.module("app").controller("monitorEmail", ['$scope', '$http', '$window', 'toastr', 'categoryService', 'authService', 'monitorLogService', '$state', '$timeout', '$uibModal', 'appSetting', monitorEmail]);
	function monitorEmail($scope, $http, $window, toastr, categoryService, authService, monitorLogService, $state, $timeout, $uibModal, appSetting) {
		var ctrl = this;
		// ctrl.title=""
		// alert(2);
		ctrl.permissions = [];
		ctrl.categories = [];
		ctrl.status = ['All', 'Active', 'Inactive'];
		ctrl.pageSizes = [20, 50, 100, 200];
		ctrl.totalPage = 0;
		ctrl.priorities = [];
		ctrl.state = "add";
		ctrl.criteria = {
			pageNumber: 1,
			pageSize: ctrl.pageSizes[0],
			total: 0,
			sortingOrder: 'log_type',
			reverse: 'asc',
			ReportName: "",
			startDate: "",
			endDate: ""
		}

		ctrl.canView = false;
		ctrl.canEdit = false;
		ctrl.categoryType = null;
		ctrl.canEditCategoryDashboardReport = true;
		console.log(ctrl.canEditCategoryDashboardReport);
		ctrl.canView = authService.isGranted('view_monitor_email');
		categoryService.getCategoryTypes().then(function (r) {
			console.log(r);
			angular.forEach(r, function (v, k) {
				if (v.name == 'Dashboard') {
					ctrl.categoryType = v;
					console.log(ctrl.categoryType)
				}
			})
		})
		ctrl.reportEmails = [];
		function format(date) {
			date = new Date(date);

			var day = date.getDate(), month = date.getMonth() + 1, year = date.getFullYear();
			return (day >= 10 ? day : '0' + day) + '/' + (month >= 10 ? month : '0' + month) + '/' + year;

		}
		ctrl.SearchReportEmails = function () {
			$('#searchresult').block({
				message: loading,
				css: { border: '0px', backgrroundColor: 'none', fontSize: '0.4em' }
			});
			monitorLogService.SearchEmailQueues(ctrl.criteria).then(function (result) {
				ctrl.reportEmails = result.emailQueues.map(function (item) {
					item.dueDate = format(item.dueDate);
					return item;
				});
				ctrl.criteria.total = result.total;
				// ctrl.criteria.results = r.policies;
				let x = Math.floor(result.total / ctrl.criteria.pageSize);
				if ((result.total % ctrl.criteria.pageSize) >= 1)
					x = x + 1;

				ctrl.totalPage = x;
				$('#searchresult').unblock();
			})
		}
		ctrl.SearchReportEmails();
		// alert(ctrl.canEdit)


		// chang sorting order
		ctrl.sort_by = function (newSortingOrder) {
			if (ctrl.criteria.sortingOrder == newSortingOrder)
				ctrl.criteria.reverse = ctrl.criteria.reverse == 'asc' ? 'desc' : 'asc';

			ctrl.criteria.sortingOrder = newSortingOrder;

			ctrl.SearchReportEmails();
		};


		ctrl.clearSearch = function () {
			ctrl.criteria = {
				pageNumber: 1,
				pageSize: ctrl.pageSizes[0],
				total: 0,
				sortingOrder: 'log_type',
				reverse: 'asc',
				ReportName: "",
				startDate: "",
				endDate: ""
			}
			ctrl.SearchReportEmails();
		}
		ctrl.previousPage = function () {
			if (ctrl.criteria.pageNumber > 1 && ctrl.totalPage > 1) {
				ctrl.criteria.pageNumber = ctrl.criteria.pageNumber - 1;
				ctrl.SearchReportEmails();
			}
		}
		ctrl.nextPage = function () {
			if (ctrl.criteria.pageNumber >= 1 && (ctrl.criteria.pageNumber < ctrl.totalPage)) {
				ctrl.criteria.pageNumber = ctrl.criteria.pageNumber + 1;
				ctrl.SearchReportEmails();
			}
		}
		ctrl.changePageSize = function () {
			ctrl.criteria.pageNumber = 1;
			ctrl.SearchReportEmails();
		}
		ctrl.updateNewsPriority = function (id, priority) {
			newsService.updateNewsPriority(id, priority).then(function (r) {
				ctrl.searchNews();
				toastr.success("บันทึกสำเร็จ");
			}, function (err) {
				toastr.error(err.statusText, 'Error');
			});
		}
		ctrl.updateNewsStatus = function (id, status) {
			newsService.updateNewsStatus(id, status).then(function (r) {
				toastr.success("บันทึกสำเร็จ");
				ctrl.searchNews();
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



		ctrl.goto = function (sel, obj) {
			// alert("MonitorTableau");
			if (sel === 'Dashboard') {
				$state.go('portal.dashboard');
			} else if (sel === 'AllNews') {
				$state.go('portal.news');
			} else if (sel === 'AddNews') {
				$state.go('portal.editnews', { obj: { mode: 'add', data: null } });
			} else if (sel === 'EditNews') {
				$state.go('portal.editnews', { obj: { mode: 'edit', data: obj } });
			} else if (sel === "AddDashboardReport") {
				ctrl.title = "Add Dashboard Report";
				ctrl.state = "add";
				$state.go('portal.addDashboardReport', { obj: { mode: 'add', data: null } });
			} else if (sel === "EditDashboardReport") {
				ctrl.title = "Edit Dashboard Report";
				ctrl.state = "edit";
				this.editObj = obj;
				$state.go('portal.addDashboardReport', { obj: { mode: 'edit', data: obj } });
			} else if (sel === "TablueDetail") {
				$state.go('portal.tablueDetail', { obj: { mode: 'edit', data: obj } });
			} else if (sel == "MonitorTableau") {
				// alert(11);
				$state.go('portal.monitorTableau');
			}
		}
		ctrl.preview = function (item) {
			var url = $state.href('preview', { p: item.id, m: 'news' });
			$window.open(url, '_blank');
		}
		ctrl.reprocess = function (item) {
			var obj = { id: item.id }
			$('#searchresult').block({
				message: loading,
				css: { border: '0px', backgrroundColor: 'none', fontSize: '0.4em' }
			});
			var fd = new FormData();
			for (var key in obj) {
				fd.append(key, item[key]);
			}
			$http.post(appSetting.apiBaseUrl + '/api/report/reSyncEmailQueue', fd, {
				transformRequest: angular.identity,
				headers: {
					'Content-Type': undefined
				}
			}).then(function (r) {
				// console.log(r.data);
				$("#searchresult").unblock();
				ctrl.SearchReportEmails();
			}, function (err) {
				ctrl.processing = false;
				toastr.error(err.statusText, 'Error');
			});
			// alert(1);

			// item={};

		}
		// init data

	}
	angular.module("app").controller("EditNewsCtrl", ['$scope', '$http', '$window', 'toastr', 'authService', 'newsService', '$state', '$stateParams', 'storageService', '$timeout', '$uibModal', 'Upload', 'appSetting', 'mediaService', 'clipboard', EditNewsCtrl]);
	function EditNewsCtrl($scope, $http, $window, toastr, authService, newsService, $state, $stateParams, storageService, $timeout, $uibModal, Upload, appSetting, mediaService, clipboard) {
		var ctrl = this;
		ctrl.topicMaxLength = 200;
		ctrl.descMaxLength = 1000;

		// tinymce options
		$scope.tinymceOptions = {
			onChange: function (e) {
				// put logic here for keypress and cut/paste changes
			},
			theme: "modern",
			language: 'th_TH',
			menubar: false,
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
			height: 300
		};

		ctrl.title = "Add News";
		ctrl.newsModel = null;
		ctrl.processing = false;

		ctrl.canViewNews = false;
		ctrl.canEditNews = false;
		ctrl.canViewNews = authService.isGranted('view_news');
		ctrl.canEditNews = authService.isGranted('modify_news');

		ctrl.stateModel = $stateParams.obj;
		if ($stateParams.obj !== null) {
			storageService.setData('stateModel', $stateParams.obj);
		}

		if (storageService.getData('stateModel') !== null && storageService.getData('stateModel') !== undefined) {
			ctrl.stateModel = storageService.getData('stateModel');
		}

		// load master
		newsService.getNewsMaster().then(function (r) {
			ctrl.permissions = r.permissions;
			ctrl.categories = r.categories;

			// switch binding
			if (ctrl.stateModel.mode === 'add') {
				ctrl.title = "Add News";
				ctrl.newsModel = {
					id: 0,
					topic: null,
					description: '',
					detail: '',
					thumbnail: 'images/nopic.png',
					newsImages: [],
					announceDate: getCurrentDateStr(),
					status: true,
					selectedCategory: ctrl.categories[0],
					selectedPermission: ctrl.permissions[0]
				};
			}
			else if (ctrl.stateModel.mode === 'edit') {
				ctrl.title = "Edit News";
				let id = ctrl.stateModel.data.id;
				ctrl.getEditNewsData(id)
			}
		}, function (err) {
			toastr.error(err.statusText, 'Error');
		});

		ctrl.getEditNewsData = function (id) {
			newsService.getEditNewsByID(id).then(function (r) {
				ctrl.newsModel = {
					id: r.id,
					topic: r.topic,
					description: r.description,
					detail: r.detail,
					announceDate: parseISOStringToDateStr(r.announceDate),
					thumbnail: r.thumbnail !== null ? r.thumbnail : 'images/nopic.png',
					newsImages: r.newsImages,
					status: r.status,
					selectedCategory: null,
					selectedPermission: null,
					updatedDate: r.updatedDate,
					updatedBy: r.updatedBy,
					createdDate: r.createdDate,
					createdBy: r.createdBy
				};
				angular.forEach(ctrl.newsModel.newsImages, function (value, key) {
					value.selected = false;
					value.state = "update";
				});

				angular.forEach(ctrl.categories, function (value, key) {
					if (r.categoryID === value.id)
						ctrl.newsModel.selectedCategory = value;
				});
				angular.forEach(ctrl.permissions, function (value, key) {
					if (r.accessGroupID === value.id)
						ctrl.newsModel.selectedPermission = value;
				});
			}, function (err) {
				toastr.error(err.statusText, 'Error');
			});
		}

		// image cropper

		ctrl.deleteCoverImage = function () {
			ctrl.newsModel.thumbnail = 'images/nopic.png';
		}
		var img = document.getElementById("my-cover-image");
		ctrl.current_size = (img.naturalWidth + 'x' + img.naturalHeight);
		console.log(ctrl.current_size);
		img.onload = function () {
			ctrl.current_size = (this.naturalWidth + 'x' + this.naturalHeight);
			console.log(ctrl.current_size);
			$scope.$apply();
		}
		ctrl.uploadCoverImage = function () {

			var modalInstanceCtrl = ['$scope', '$uibModalInstance', function ($scope, $uibModalInstance) {


				$scope.myCroppedImage = '';
				$scope.myImage = '';
				$scope.current_size = "";
				$scope.triggerUpload = function () {
					var fileuploader = angular.element("#fileInput");
					fileuploader.on('click', function () { })
					fileuploader.on('change', handleFileSelect);
					fileuploader.trigger('click')
				}
				$scope.blockingObject = { block: true };
				$scope.cropFuntion = function () {
					// $scope.blockingObject.render(function (dataURL) {
					// 	console.log('via render');
					// 	console.log(dataURL.length);
					// });
					// console.log($scope.myCroppedImage);
					$uibModalInstance.close($("#result-text").html());
				}
				// $scope.blockingObject.callback = function (dataURL) {
				// 	$uibModalInstance.close(dataURL);
				// }
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
				// console.log(dataURL);
				if (dataURL) {
					ctrl.newsModel.thumbnail = dataURL;

				}
			});
		}

		// upload images
		ctrl.files = [];
		ctrl.setNewsImages = function (files) {
			let max = 0;
			angular.forEach(ctrl.newsModel.newsImages, function (value, key) {
				max = value.id;
			});
			angular.forEach(files, function (value, key) {
				if (!value.$error) {
					// append new upload files
					var f = {
						id: max + 1,
						state: "new",
						file: value
					};
					max = f.id;
					var found = false;
					for (var i = 0; i < ctrl.newsModel.newsImages.length; i++) {
						if (value === ctrl.newsModel.newsImages[i].file) {
							found = true;
						}
					}
					if (!found) {
						ctrl.newsModel.newsImages.push(f);
					}
				}
			})
		}
		ctrl.allCheck = false;
		ctrl.selectAllImages = function () {
			ctrl.allCheck = !ctrl.allCheck;
			angular.forEach(ctrl.newsModel.newsImages, function (value, key) {
				if (ctrl.allCheck)
					value.selected = true;
				else
					value.selected = false;
			});
		}
		ctrl.deleteNewsImages = function () {
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

				if (confirm && ctrl.newsModel.newsImages.length > 0) {
					var ids = [];
					var tempids = [];
					var found = false;
					for (var v = 0; v < ctrl.newsModel.newsImages.length; v++) {
						var m = ctrl.newsModel.newsImages[v];
						console.log(m);
						if (m.state == 'update' && m.selected) {
							ids.push(m.id);
						}
						else if (m.state == 'new' && m.selected) {
							found = true;
							for (var i = 0; i < ctrl.files.length; i++) {
								if (ctrl.files[i] === m.file) {
									tempids.push(m.id);
									ids.push(m.id);
									ctrl.files.splice(i, 1);
									i--;
								}
							}
						}
					}

					if (ids.length > 0) {
						$('#img-block').block({
							message: '<h1>please wait..</h1>',
							css: { border: '0px', backgroundColor: 'none', fontSize: '0.4em' }
						});
						newsService.deleteNewsImages(ids).then(function (r) {
							$('#img-block').unblock();
							for (var j = 0; j < ids.length; j++) {
								for (var v = 0; v < ctrl.newsModel.newsImages.length; v++) {
									var s = ctrl.newsModel.newsImages[v];
									if (ids[j] == s.id) {
										ctrl.newsModel.newsImages.splice(v, 1);
										v--;
									}
								}
							}
							for (var j = 0; j < tempids.length; j++) {
								for (var v = 0; v < ctrl.newsModel.newsImages.length; v++) {
									var s = ctrl.newsModel.newsImages[v];
									if (tempids[j] == s.id) {
										ctrl.newsModel.newsImages.splice(v, 1);
										v--;
									}
								}
							}
							toastr.success("ลบรายการสำเร็จ");
						}, function (err) {
							$('#img-block').unblock();
							toastr.error(err.statusText, 'Error');
						});
					}
					else if (found) {
						toastr.success("ลบรายการสำเร็จ");
					}
				}
			});

		}
		ctrl.deleteNewsImage = function (obj) {

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
					if (obj.state == 'update') {
						$('#img-block').block({
							message: '<h1>please wait..</h1>',
							css: { border: '0px', backgroundColor: 'none', fontSize: '0.4em' }
						});
						var ids = [];
						ids.push(obj.id);
						newsService.deleteNewsImages(ids).then(function (r) {
							$('#img-block').unblock();
						}, function (err) {
							$('#img-block').unblock();
							toastr.error(err.statusText, 'Error');
						});
					}
					angular.forEach(ctrl.newsModel.newsImages, function (v, k) {
						if (v.id === obj.id) {
							ctrl.newsModel.newsImages.splice(k, 1);
						}
					});
					if (obj.state == 'new') {
						angular.forEach(ctrl.files, function (v, k) {
							if (v === obj.file) {
								ctrl.files.splice(k, 1);
							}
						});
					}
					toastr.success("ลบรายการสำเร็จ");
				}
			});

		}
		$scope.invalidFiles = null;
		ctrl.validateFile = function ($invalidFiles, $duplicateFiles) {
			let error = '';
			if ($invalidFiles && $invalidFiles[0] != null) {
				angular.forEach($invalidFiles, function (v, k) {
					let errType = v.$error;
					if (errType === 'pattern') {
						error += 'Invalid file type. accepted for upload only (' + v.$errorParam + ')</br>';
					}
					else if (errType === 'maxSize') {
						error += 'Exceeds the maximum file-size ( ' + v.$errorParam + '): \'' + v.name + '\'</br>';
					}
					else {
						error += v.$error + '</br>';
					}
				});
				$invalidFiles.splice(0, $invalidFiles.length);
				$scope.invalidFiles = null;
				// $scope.frmEdit.$valid = true;
				// $scope.frmEdit.$invalid = false;

				// console.log($scope.frmEdit)
				toastr.error(error, 'Error', { disableTimeOut: true, extendedTimeOut: 6000, timeOut: 6000, progressBar: false, allowHtml: true, closeButton: true, positionClass: 'toast-top-full-width' });
				// console.log($invalidFiles, ctrl.files );
				// let errType = $invalidFiles[0].$error;
				// if (errType === 'pattern'){
				// 	toastr.error('Invalid file type. accepted for upload only (' + $invalidFiles[0].$errorParam + ')', 'Error', {timeOut: 6000});
				// }
				// else if (errType === 'maxSize'){
				// 	toastr.error('Exceeds the maximum file-size ( '+$invalidFiles[0].$errorParam+' ).', 'Error', {timeOut: 6000});
				// }
				// else {
				// 	toastr.error($invalidFiles[0].$error, 'Error', {timeOut: 6000});
				// }
			}

			ctrl.setNewsImages(ctrl.files);
		}
		ctrl.submitNews = function (valid, fileValid) {
			angular.forEach($scope.frmEdit.$$controls, function (field) {
				field.$setDirty();
				field.$validate();
			});
			if (ctrl.newsModel.topic) {
				var files = [];
				angular.forEach(ctrl.newsModel.newsImages, function (value, key) {
					files.push(value.file);
				});
				ctrl.processing = true;

				var fd = new FormData();
				fd.append('ID', ctrl.newsModel.id);
				fd.append('Status', ctrl.newsModel.status);
				fd.append('Topic', ctrl.newsModel.topic);
				fd.append('Description', ctrl.newsModel.description);
				fd.append('Detail', ctrl.newsModel.detail);

				if (ctrl.newsModel.thumbnail !== 'images/nopic.png') {
					fd.append('Thumbnail', ctrl.newsModel.thumbnail);
				} else {
					fd.append('Thumbnail', null);
				}

				fd.append('CategoryID', ctrl.newsModel.selectedCategory.id);
				fd.append('AccessGroupID', ctrl.newsModel.selectedPermission.id);
				fd.append('AnnounceDatePost', ctrl.newsModel.announceDate);
				angular.forEach(ctrl.newsModel.newsImages, function (value, key) {
					// only add new file
					if (value.file != undefined) {
						fd.append('files', value.file);
					}
				});

				// reset file browsing
				ctrl.files = [];
				$http.post(appSetting.apiBaseUrl + '/api/news/saveNews', fd, {
					transformRequest: angular.identity,
					headers: {
						'Content-Type': undefined
					}
				}).then(function (r) {
					toastr.success("บันทึกสำเร็จ");
					ctrl.processing = false;
					ctrl.getEditNewsData(r.data.id);
				}, function (err) {
					ctrl.processing = false;
					toastr.error(err.statusText, 'Error');
				});
			}
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
						fd.append('module', "news");
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

		ctrl.goto = function (sel, obj) {
			if (sel === 'Dashboard') {
				$state.go('portal.dashboard');
			} else if (sel === 'AllNews') {
				$state.go('portal.news');
			}
		}
	}

	angular.module("app").controller("DownloadCtrl", ['$scope', '$http', '$window', 'toastr', 'authService', 'downloadService', '$state', '$timeout', '$uibModal', DownloadCtrl]);
	function DownloadCtrl($scope, $http, $window, toastr, authService, downloadService, $state, $timeout, $uibModal) {
		var ctrl = this;

		ctrl.permissions = [];
		ctrl.categories = [];
		ctrl.subCategories = [];
		ctrl.status = ['All', 'Active', 'Inactive'];
		ctrl.documentStatus = ['All', 'WaitForReview', 'Active', 'Canceled'];
		ctrl.pageSizes = [20, 50, 100, 200];
		ctrl.totalPage = 0;
		ctrl.priorities = [1, 2, 3, 4, 5, 6, 7, 8, 9];
		ctrl.criteria = {
			topic: '',
			SubCategoryID: '',
			dateFrom: null,
			dateTo: null,
			selectedCategory: null,
			selectedPermission: null,
			selectedStatus: ctrl.status[0],
			selectedSyncStatus: ctrl.documentStatus[0],
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
		ctrl.canView = authService.isGranted('view_download');
		ctrl.canEdit = authService.isGranted('modify_download');

		ctrl.getDocumentSearchCriteria = function () {
			downloadService.getDocumentSearchCriteria().then(function (r) {
				ctrl.permissions = r.permissions;
				ctrl.categories = r.categories;
				ctrl.criteria.selectedCategory = ctrl.categories[0];
				ctrl.criteria.selectedPermission = ctrl.permissions[0];
				ctrl.searchDocuments();
			}, function (err) {
				if (err.data)
					toastr.error(err.data.MessageDetail, 'Error');
				else
					toastr.error(err.Message, 'Error');
			});
		};

		// chang sorting order
		ctrl.sort_by = function (newSortingOrder) {
			if (ctrl.criteria.sortingOrder == newSortingOrder)
				ctrl.criteria.reverse = !ctrl.criteria.reverse;

			ctrl.criteria.sortingOrder = newSortingOrder;

			ctrl.searchDocuments(true);
		};
		ctrl.updateStatus = function (r) {
			$('#searchresult').block({
				message: loading,
				css: { border: '0px', backgroundColor: 'none', fontSize: '0.4em' }
			});
			downloadService.updateStatus({
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
		ctrl.searchDocuments = function (isClickSearch) {
			$('#searchresult').block({
				message: loading,
				css: { border: '0px', backgroundColor: 'none', fontSize: '0.4em' }
			});
			if (isClickSearch) {
				ctrl.criteria.pageNumber = 1;
				ctrl.criteria.pageSize = ctrl.pageSizes[0];
			}
			downloadService.searchDocuments(ctrl.criteria).then(function (r) {
				$('#searchresult').unblock();
				ctrl.criteria.total = r.total;
				ctrl.criteria.results = r.documents;
				ctrl.criteria.totalCounter = r.totalCounter;

				let x = Math.floor(r.total / ctrl.criteria.pageSize);
				if ((r.total % ctrl.criteria.pageSize) >= 1)
					x = x + 1;

				ctrl.totalPage = x;
				ctrl.criteria.pageNumber = r.pageNumber;
			}, function (err) {
				toastr.error(err.statusText, 'Error');
			});
		}
		ctrl.refreshDocumentStatus = function () {
			if (ctrl.criteria.selectedCategory.name !== 'Guideline') {
				ctrl.criteria.selectedSyncStatus = ctrl.documentStatus[0];
			}

			downloadService.getSubCategories(ctrl.criteria.selectedCategory.id).then(function (r) {
				console.table(r);
				ctrl.subCategories = r;
			}, function (err) {
				toastr.error(err.statusText, 'Error');
			})
		}
		ctrl.clearSearch = function () {
			ctrl.criteria = {
				topic: '',
				dateFrom: null,
				dateTo: null,
				selectedCategory: ctrl.categories[0],
				selectedPermission: ctrl.permissions[0],
				selectedStatus: ctrl.status[0],
				pageNumber: 1,
				pageSize: ctrl.pageSizes[0],
				total: 0,
				sortingOrder: 'n.[Priority]',
				reverse: false,
				totalCounter: 0
			}
			ctrl.searchDocuments();
		}
		ctrl.previousPage = function () {
			if (ctrl.criteria.pageNumber > 1 && ctrl.totalPage > 1) {
				ctrl.criteria.pageNumber = ctrl.criteria.pageNumber - 1;
				ctrl.searchDocuments();
			}
		}
		ctrl.nextPage = function () {
			if (ctrl.criteria.pageNumber >= 1 && (ctrl.criteria.pageNumber < ctrl.totalPage)) {
				ctrl.criteria.pageNumber = ctrl.criteria.pageNumber + 1;
				ctrl.searchDocuments();
			}
		}
		ctrl.changePageSize = function () {
			ctrl.criteria.pageNumber = 1;
			ctrl.searchDocuments();
		}
		ctrl.updateDocumentPriority = function (id, priority) {
			console.log(id,priority);
			downloadService.updateDocumentPriority(id, priority).then(function (r) {
				ctrl.searchDocuments();
				toastr.success("บันทึกสำเร็จ");
			}, function (err) {
				toastr.error(err.statusText, 'Error');
			});
		}
		ctrl.updateDocumentStatus = function (id, status) {
			downloadService.updateDocumentStatus(id, status).then(function (r) {
				toastr.success("บันทึกสำเร็จ");
				ctrl.searchDocuments();
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
		ctrl.deleteDocuments = function () {

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
						downloadService.deleteDocuments(deletedIds).then(function (r) {
							ctrl.processing = false;
							toastr.success("ลบรายการสำเร็จ");
							ctrl.searchDocuments();
						}, function (err) {
							ctrl.processing = false;
							toastr.error(err.statusText, 'Error');
						});
					}
				}
			});
		}

		ctrl.goto = function (sel, obj) {
			if (sel === 'Dashboard') {
				$state.go('portal.dashboard');
			} else if (sel === 'AllDownload') {
				$state.go('portal.download');
			} else if (sel === 'AddDownload') {
				$state.go('portal.editdoc', { obj: { mode: 'add', data: null } });
			} else if (sel === 'EditDownload') {
				$state.go('portal.editdoc', { obj: { mode: 'edit', data: obj } });
			}
		}

		// init data
		ctrl.getDocumentSearchCriteria();
	}

	angular.module("app").controller("EditDownloadCtrl", ['$scope', '$http', '$window', 'toastr', 'authService', 'downloadService', '$state', '$stateParams', 'storageService', '$timeout', '$uibModal', 'Upload', 'appSetting', EditDownloadCtrl]);
	function EditDownloadCtrl($scope, $http, $window, toastr, authService, downloadService, $state, $stateParams, storageService, $timeout, $uibModal, Upload, appSetting) {
		var ctrl = this;
		ctrl.topicMaxLength = 200;
		ctrl.descMaxLength = 1000;

		ctrl.title = "Add Download";
		ctrl.documentModel = null;
		ctrl.makeReadOnly = false;
		ctrl.processing = false;
		ctrl.typevdo = 'filesUpload';

		ctrl.stateModel = $stateParams.obj;
		if ($stateParams.obj !== null) {
			storageService.setData('stateModel', $stateParams.obj);
		}

		if (storageService.getData('stateModel') !== null && storageService.getData('stateModel') !== undefined) {
			ctrl.stateModel = storageService.getData('stateModel');
		}

		// load master
		ctrl.documentTypes = [
			{ id: "M", name: "Manual" },
			{ id: "P", name: "Procedure" },
			{ id: "W", name: "Work Instruction" },
			{ id: "F", name: "Form" },
			{ id: "S", name: "Supporting" },
		];
		ctrl.documentStatus = [
			{ id: "WaitForReview", name: "WaitForReview" },
			{ id: "Active", name: "Active" },
			{ id: "Canceled", name: "Canceled" }
		];

		ctrl.canView = false;
		ctrl.canEdit = false;
		ctrl.canView = authService.isGranted('view_download');
		ctrl.canEdit = authService.isGranted('modify_download');
		var img = document.getElementById("my-cover-image");
		ctrl.current_size = (img.naturalWidth + 'x' + img.naturalHeight);
		console.log(ctrl.current_size);
		img.onload = function () {
			ctrl.current_size = (this.naturalWidth + 'x' + this.naturalHeight);
			console.log(ctrl.current_size);
			$scope.$apply();
		}

		downloadService.getDocumentMaster().then(function (r) {
			ctrl.permissions = r.permissions;
			ctrl.categories = r.categories;
			ctrl.subCategories = r.subCategories;
			ctrl.filterSubCategories = null;

			// switch binding
			if (ctrl.stateModel.mode === 'add') {
				ctrl.title = "Add Download";
				ctrl.documentModel = {
					id: 0,
					documentName: null,
					description: null,
					documentDate: getCurrentDateStr(),
					status: true,
					youtubeURL: null,
					pdfFileName: null,
					vdoFileName: null,
					thumbnail: 'images/nopic.png',
					documentImages: [],
					selectedCategory: ctrl.categories[0],
					selectedSubCategory: null,
					selectedPermission: ctrl.permissions[0],
					selectedDocumentType: ctrl.documentTypes[0],
					documentID: null,
					version: null,
					ownerDepartment: null,
					complianceLevel: null,
					icon: null,
					color: '#fcb712'
				};
				ctrl.filterSubCategories = [];
				ctrl.filterSubCategories.push({
					id: 0,
					categoryID: 0,
					name: '- Please select -'
				});
				ctrl.documentModel.selectedSubCategory = ctrl.filterSubCategories[0];
				if (ctrl.subCategories && ctrl.subCategories.length > 0) {
					angular.forEach(ctrl.subCategories, function (value, key) {
						if (ctrl.documentModel.selectedCategory.id === value.categoryID) {
							ctrl.filterSubCategories.push(value);
						}
					});
					ctrl.documentModel.selectedSubCategory = ctrl.filterSubCategories[0];
				}
			}
			else if (ctrl.stateModel.mode === 'edit') {
				ctrl.title = "Edit Download";
				let id = ctrl.stateModel.data.id;
				ctrl.getEditDocumentData(id)
			}
		}, function (err) {
			toastr.error(err.statusText, 'Error');
		});

		ctrl.getEditDocumentData = function (id) {
			downloadService.getEditDocumentByID(id).then(function (r) {

				ctrl.documentModel = {
					id: r.id,
					documentName: r.documentName,
					description: r.description,
					documentDate: parseISOStringToDateStr(r.documentDate),
					status: r.status,
					documentStatus: r.documentStatus,
					youtubeURL: r.youtubeURL,
					thumbnail: r.thumbnail !== null ? r.thumbnail : 'images/nopic.png',
					pdfFileName: r.pdfFileName,
					vdoFileName: r.vdoFileName,
					documentImages: r.documentImages,
					selectedCategory: null,
					selectedSubCategory: null,
					selectedPermission: null,
					selectedDocumentType: null,
					documentID: r.documentID,
					version: r.version,
					ownerDepartment: r.ownerDepartment,
					complianceLevel: r.complianceLevel,
					updatedDate: r.updatedDate,
					updatedBy: r.updatedBy,
					createdDate: r.createdDate,
					createdBy: r.createdBy,
					icon: r.icon,
					color: r.color == null ? '#fcb712' : r.color
				};
				angular.forEach(ctrl.documentModel.documentImages, function (value, key) {
					value.selected = false;
					value.state = "update";
				});

				angular.forEach(ctrl.documentTypes, function (value, key) {

					if (r.documentType === value.id)
						ctrl.documentModel.selectedDocumentType = value;
				});
				if (ctrl.documentModel.selectedDocumentType == null) {
					ctrl.documentModel.selectedDocumentType = ctrl.documentTypes[0];
				}

				angular.forEach(ctrl.categories, function (value, key) {
					if (r.categoryID === value.id)
						ctrl.documentModel.selectedCategory = value;
				});
				angular.forEach(ctrl.permissions, function (value, key) {
					if (r.accessGroupID === value.id)
						ctrl.documentModel.selectedPermission = value;
				});
				ctrl.filterSubCategories = [];
				ctrl.filterSubCategories.push({
					id: 0,
					categoryID: 0,
					name: '- Please select -'
				});
				ctrl.documentModel.selectedSubCategory = ctrl.filterSubCategories[0];
				angular.forEach(ctrl.subCategories, function (value, key) {
					if (ctrl.documentModel.selectedCategory.id === value.categoryID) {
						ctrl.filterSubCategories.push(value);
					}
				});
				angular.forEach(ctrl.subCategories, function (value, key) {
					if (r.subCategoryID === value.id) {
						ctrl.documentModel.selectedSubCategory = value;
					}
				});
				angular.forEach(ctrl.documentStatus, function (value, key) {
					if (r.documentStatus === value.id)
						ctrl.documentModel.documentStatus = value;
				});

				// only for category guideline and content which sync from other document system
				if (ctrl.documentModel.id != 0 && ctrl.documentModel.documentStatus && ctrl.documentModel.selectedCategory.name == 'Guideline') {
					ctrl.makeReadOnly = true;
				}

				// for display layout type vdo
				if (ctrl.documentModel.selectedCategory.displayLayout === 'DISPLAY_4') {
					if (ctrl.documentModel.vdoFileName) {
						ctrl.typevdo = 'filesUpload';
					}
					else if (ctrl.documentModel.youtubeURL) {
						ctrl.typevdo = 'url';
					}
				}
			}, function (err) {
				toastr.error(err.statusText, 'Error');
			});
		}

		ctrl.showCoverImage = true;
		ctrl.selectedCategoryChange = function () {
			ctrl.filterSubCategories = [];
			ctrl.filterSubCategories.push({
				id: 0,
				categoryID: 0,
				name: '- Please select -'
			});
			ctrl.documentModel.selectedSubCategory = ctrl.filterSubCategories[0];
			angular.forEach(ctrl.subCategories, function (value, key) {
				if (ctrl.documentModel.selectedCategory.id === value.categoryID) {
					ctrl.filterSubCategories.push(value);
				}
			});
			if (ctrl.filterSubCategories !== null && ctrl.filterSubCategories.length > 0)
				ctrl.documentModel.selectedSubCategory = ctrl.filterSubCategories[0];

			// reset file selected
			ctrl.removeVDOFile();
			ctrl.removePdfFile();
			ctrl.documentModel.youtubeURL = null;

			//if (ctrl.DISPLAY_4)
			// when select cateogry VDO hide cover image section
			ctrl.showCoverImage = true;
			if (ctrl.documentModel.selectedCategory.displayLayout == 'DISPLAY_4') {
				ctrl.showCoverImage = false;
				ctrl.deleteCoverImage();
			}
		}
		// reset by selected
		ctrl.selectVDOType = function () {
			ctrl.vdoFile = null;
			ctrl.documentModel.vdoFileName = null;
			var fileElement = angular.element('#vdoFileUpload');
			angular.element(fileElement).val(null);
			ctrl.documentModel.youtubeURL = null;
		}

		// image cropper
		ctrl.deleteCoverImage = function () {
			ctrl.documentModel.thumbnail = 'images/nopic.png';
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
					ctrl.documentModel.thumbnail = dataURL;
				}
			});
		}

		// upload pdf and docs file
		ctrl.pdffile = null;
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
				if (ctrl.pdffile != null) {
					ctrl.documentModel.pdfFileName = ctrl.pdffile.name;
				}
			}
		}
		ctrl.selectPdfFile = function () {
			/*if (ctrl.pdffile != null) {
				ctrl.documentModel.pdfFileName = ctrl.pdffile.name;
			}*/
		}
		ctrl.removePdfFile = function () {
			ctrl.documentModel.pdfFileName = null;
			ctrl.pdffile = null;
		}

		// upload vdo file
		ctrl.vdoFile = null;
		ctrl.validateVDOFile = function ($invalidVDOFiles) {
			if ($invalidVDOFiles && $invalidVDOFiles[0] != null) {
				let errType = $invalidVDOFiles[0].$error;
				if (errType === 'pattern') {
					toastr.error('Invalid file type. accepted for upload only (' + $invalidVDOFiles[0].$errorParam + ')', 'Error', { timeOut: 6000 });
				}
				else if (errType === 'maxSize') {
					toastr.error('Exceeds the maximum file-size ( ' + $invalidVDOFiles[0].$errorParam + ' ).', 'Error', { timeOut: 6000 });
				}
				else {
					toastr.error($invalidVDOFiles[0].$error, 'Error', { timeOut: 6000 });
				}
			}
			else {
				if (ctrl.vdoFile != null) {
					ctrl.documentModel.vdoFileName = ctrl.vdoFile.name;
				}
			}
		}
		ctrl.removeVDOFile = function () {
			ctrl.documentModel.vdoFileName = null;
			ctrl.vdoFile = null;
		}

		ctrl.submitDocument = function (valid) {
			angular.forEach($scope.frmEdit.$$controls, function (field) {
				field.$setDirty();
				field.$validate();
			});
			if (valid) {
				var postObj = {
					id: ctrl.documentModel.id,
					status: ctrl.documentModel.status,
					documentName: ctrl.documentModel.documentName,
					description: ctrl.documentModel.description,
					categoryID: ctrl.documentModel.selectedCategory.id,
					subCategoryID: ctrl.documentModel.selectedSubCategory != null ? ctrl.documentModel.selectedSubCategory.id : 0,
					accessGroupID: ctrl.documentModel.selectedPermission.id,
					documentDate: ctrl.documentModel.documentDate,
					youtubeURL: ctrl.documentModel.youtubeURL
				};
				let check = false;
				angular.forEach(ctrl.subCategories, function (value, key) {
					if (ctrl.documentModel.selectedCategory.id === value.categoryID) {
						check = true;
					}
				});
				if (!check) {
					postObj.subCategoryID = 0;
					ctrl.documentModel.selectedSubCategory = null;
				}

				var files = [];
				angular.forEach(ctrl.documentModel.documentImages, function (value, key) {
					files.push(value.file);
				});

				var fd = new FormData();
				fd.append('ID', postObj.id);
				fd.append('Status', postObj.status);
				fd.append('DocumentName', ctrl.documentModel.documentName);
				fd.append('Description', ctrl.documentModel.description);
				fd.append('CategoryID', postObj.categoryID);
				fd.append('SubCategoryID', postObj.subCategoryID);
				fd.append('AccessGroupID', postObj.accessGroupID);
				fd.append('DocumentDatePost', postObj.documentDate);
				fd.append('YoutubeURL', ctrl.documentModel.youtubeURL);

				if (ctrl.documentModel.thumbnail !== 'images/nopic.png') {
					fd.append('Thumbnail', ctrl.documentModel.thumbnail);
				} else {
					fd.append('Thumbnail', null);
				}

				// only for category guideline and content which sync from other document system
				if (ctrl.documentModel.id != 0 && ctrl.documentModel.documentStatus && ctrl.documentModel.selectedCategory.name == 'Guideline') {
					fd.append('DocumentStatus', ctrl.documentModel.documentStatus.id);
				}
				else {
					fd.append('DocumentStatus', null);
				}
				fd.append('DocumentType', ctrl.documentModel.selectedDocumentType.id);
				fd.append('DocumentID', ctrl.documentModel.documentID);
				fd.append('Version', ctrl.documentModel.version);
				fd.append('OwnerDepartment', ctrl.documentModel.ownerDepartment);
				fd.append('ComplianceLevel', ctrl.documentModel.complianceLevel);
				fd.append('Icon', ctrl.documentModel.icon);
				fd.append('Color', ctrl.documentModel.color);
				fd.append('PdfFileName', ctrl.documentModel.pdfFileName);
				fd.append('VdoFileName', ctrl.documentModel.vdoFileName);

				// VDO
				//console.log('ctrl.documentModel.displayLayout', ctrl.documentModel.selectedCategory.displayLayout);
				if (ctrl.documentModel.selectedCategory.displayLayout != 'DISPLAY_4') {
					if ((!ctrl.documentModel.pdfFileName || ctrl.documentModel.pdfFileName == null) && ctrl.pdffile == null) {
						toastr.error("กรุณาอัพโหลดไฟล์แนบ.");
						return;
					}
				}

				if (ctrl.documentModel.pdfFileName != null && ctrl.pdffile != null) {
					fd.append('pdffile', ctrl.pdffile);
				} else {
					fd.append('pdffile', null);
				}
				if (ctrl.documentModel.vdoFileName != null && ctrl.vdoFile != null) {
					fd.append('vdofile', ctrl.vdoFile);
				} else {
					fd.append('vdofile', null);
				}


				// reset file browsing
				ctrl.files = [];
				ctrl.pdffile = null;
				ctrl.vdoFile = null;
				ctrl.processing = true;
				$http.post(appSetting.apiBaseUrl + '/api/download/saveDocument', fd, {
					transformRequest: angular.identity,
					headers: {
						'Content-Type': undefined
					}
				}).then(function (r) {
					toastr.success("บันทึกสำเร็จ");
					ctrl.processing = false;
					ctrl.getEditDocumentData(r.data.id);
				}, function (err) {
					ctrl.processing = false;
					toastr.error(err.statusText, 'Error');
				});
			}
		}

		ctrl.goto = function (sel, obj) {
			if (sel === 'Dashboard') {
				$state.go('portal.dashboard');
			} else if (sel === 'AllDownload') {
				$state.go('portal.download');
			}
		}

	}

	angular.module("app").controller("DashboardCategory", ['$scope', '$http', '$uibModal', 'toastr', 'authService', '$window', '$rootScope', '$sce', '$state', 'categoryService', 'Upload', 'appSetting', 'dashboardReportService', DashboardCategory]);
	function DashboardCategory($scope, $http, $uibModal, toastr, authService, $window, $rootScope, $sce, $state, categoryService, Upload, appSetting, dashboardReportService) {
		var ctrl = this;
		ctrl.state = 'add';
		ctrl.title = 'Add Category';
		ctrl.categoryType = '';
		ctrl.categories = [];
		ctrl.status = ['Active', 'Inactive'];

		ctrl.editObj = null;
		ctrl.canView = false;
		ctrl.canEdit = false;
		ctrl.categoryType = null;
		ctrl.canEditCategoryDashboardReport = true;
		console.log(ctrl.canEditCategoryDashboardReport);
		ctrl.canViewCategoryDashboard = authService.isGranted('view_category_dashboard');
		ctrl.canModifyCategoryDashboard = authService.isGranted('modify_category_dashboard');
		ctrl.resetEditObj = function () {

			ctrl.editObj = {
				id: 0,
				name: null,
				status: 'Inactive',
				icon: null,
				deleteIconImage: false,
				iconImagePath: null,
				file: null,
				color: '#fcb712'
			};
		}

		ctrl.canViewCategoryNews = false;
		ctrl.canEditCategoryNews = false;
		ctrl.canViewCategoryNews = authService.isGranted('view_category_news');
		ctrl.canEditCategoryNews = authService.isGranted('modify_category_news');

		categoryService.getCategoryTypes().then(function (r) {
			console.log(r);
			angular.forEach(r, function (v, k) {
				if (v.name == 'Dashboard') {
					ctrl.categoryType = v;
				}
			})
		})
		ctrl.getDashboardReportCriteria = function () {
			dashboardReportService.getDashboardReportCriteria().then(function (r) {

				ctrl.categories = r;

			}, function (err) {
				if (err.data)
					toastr.error(err.data.MessageDetail, 'Error');
				else
					toastr.error(err.Message, 'Error');
			});
		}

		ctrl.toggleAll = function () {
			var toggleStatus = !ctrl.isAllSelected;
			if (toggleStatus) {
				ctrl.showDelete = true;
			} else {
				ctrl.showDelete = false;
			}
			angular.forEach(ctrl.categories, function (itm) {
				if (itm.default === false) {
					itm.selected = toggleStatus;
				}
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
				ctrl.getDashboardReportCriteria();
			}, function (err) {
				toastr.error(err.statusText, 'Error');
			})
		}
		ctrl.editCategory = function (s) {
			ctrl.state = 'edit';
			ctrl.title = 'Edit Category';
			ctrl.editObj = angular.copy(s);
			if (ctrl.editObj.color == null) {
				ctrl.editObj.color = '#fcb712';
			}
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
				color: '#fcb712',
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
					ctrl.editObj.displayLayout = 'LAYOUT_ANNOUNCEMENT';
				}

				console.log("come in");
				var fd = new FormData();
				fd.append('ID', ctrl.editObj.id);
				fd.append('Status', ctrl.editObj.status);
				fd.append('Name', ctrl.editObj.name);
				fd.append('CategoryTypeID', ctrl.categoryType.id);
				fd.append('Icon', ctrl.editObj.icon);
				fd.append('Color', ctrl.editObj.color);
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
					ctrl.getDashboardReportCriteria();
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
							ctrl.getDashboardReportCriteria();
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
				ctrl.g();
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
		// ctrl.resetDashboard_report();
		ctrl.getDashboardReportCriteria();
	}
	angular.module("app").controller("NewsCategory", ['$scope', '$http', '$uibModal', 'toastr', 'authService', '$window', '$rootScope', '$sce', '$state', 'categoryService', 'Upload', 'appSetting', NewsCategory]);
	function NewsCategory($scope, $http, $uibModal, toastr, authService, $window, $rootScope, $sce, $state, categoryService, Upload, appSetting) {
		var ctrl = this;
		ctrl.state = 'add';
		ctrl.title = 'Add Category';
		ctrl.categoryType = '';
		ctrl.categories = [];
		ctrl.status = ['Active', 'Inactive'];

		ctrl.editObj = null;
		// ctr.dashboard_report=null;
		// ctr.resetDashboard_report=function(){
		// 	alert(11);
		// 	ctr.dashboard_report={
		// 		dashboard_report:null
		// 	}
		// }
		ctrl.resetEditObj = function () {

			ctrl.editObj = {
				id: 0,
				name: null,
				status: 'Inactive',
				icon: null,
				deleteIconImage: false,
				iconImagePath: null,
				file: null,
				color: '#fcb712'
			};
		}

		ctrl.canViewCategoryNews = false;
		ctrl.canEditCategoryNews = false;
		ctrl.canViewCategoryNews = authService.isGranted('view_category_news');
		ctrl.canEditCategoryNews = authService.isGranted('modify_category_news');

		categoryService.getCategoryTypes().then(function (r) {
			console.log(r);
			angular.forEach(r, function (v, k) {
				if (v.name == 'News') {
					ctrl.categoryType = v;
				}
			})
		})
		ctrl.loadCategories = function () {
			categoryService.getNewsCategories().then(function (r) {
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
				if (itm.default === false) {
					itm.selected = toggleStatus;
				}
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
			if (ctrl.editObj.color == null) {
				ctrl.editObj.color = '#fcb712';
			}
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
				color: '#fcb712',
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
					ctrl.editObj.displayLayout = 'LAYOUT_ANNOUNCEMENT';
				}

				var fd = new FormData();
				fd.append('ID', ctrl.editObj.id);
				fd.append('Status', ctrl.editObj.status);
				fd.append('Name', ctrl.editObj.name);
				fd.append('CategoryTypeID', ctrl.categoryType.id);
				fd.append('Icon', ctrl.editObj.icon);
				fd.append('Color', ctrl.editObj.color);
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
		// ctrl.resetDashboard_report();
		ctrl.loadCategories();
	}

	angular.module("app").controller("DownloadCategory", ['$scope', '$http', '$uibModal', 'toastr', 'authService', '$window', '$rootScope', '$sce', '$state', 'categoryService', 'Upload', 'appSetting', DownloadCategory]);
	function DownloadCategory($scope, $http, $uibModal, toastr, authService, $window, $rootScope, $sce, $state, categoryService, Upload, appSetting) {
		var ctrl = this;
		ctrl.state = 'add';
		ctrl.title = 'Add Category';
		ctrl.categoryType = '';
		ctrl.categories = [];
		ctrl.status = ['Active', 'Inactive'];

		ctrl.displays = [
			{ id: 'DISPLAY_1', name: 'Block 3 columns x 1 row' }
			, { id: 'DISPLAY_2', name: 'Block 3 columns x 2 rows' }
			, { id: 'DISPLAY_5', name: 'Block 3 columns x 1 row (Sub Category)' }
			, { id: 'DISPLAY_3', name: 'List' }
			, { id: 'DISPLAY_4', name: 'VDO' }
		];
		// ctr.dashboard_report=null;
		// ctr.resetDashboard_report=function(){
		// 	ctr.dashboard_report={
		// 		dashboard_report:null
		// 	}
		// }
		ctrl.editObj = null;
		ctrl.resetEditObj = function () {
			ctrl.editObj = {
				id: 0,
				name: null,
				status: 'Inactive',
				icon: null,
				deleteIconImage: false,
				displayLayout: 'DISPLAY_1',
				selectedDisplay: ctrl.displays[0],
				iconImagePath: null,
				color: '#fcb712',
				file: null
			};
		}

		ctrl.canView = false;
		ctrl.canEdit = false;
		ctrl.canView = authService.isGranted('view_category_download');
		ctrl.canEdit = authService.isGranted('modify_category_download');

		categoryService.getCategoryTypes().then(function (r) {
			angular.forEach(r, function (v, k) {
				if (v.name == 'Download') {
					ctrl.categoryType = v;
				}
			})
		})
		ctrl.loadCategories = function () {
			categoryService.getDownloadCategories().then(function (r) {
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
				if (itm.default === false) {
					itm.selected = toggleStatus;
				}
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
			angular.forEach(ctrl.displays, function (value, key) {
				if (s.displayLayout === value.id)
					ctrl.editObj.selectedDisplay = value;
			});
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
				displayLayout: 'DISPLAY_1',
				selectedDisplay: ctrl.displays[0],
				deleteIconImage: false,
				color: '#fcb712',
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
				}

				var fd = new FormData();
				fd.append('ID', ctrl.editObj.id);
				fd.append('Status', ctrl.editObj.status);
				fd.append('Name', ctrl.editObj.name);
				fd.append('Color', ctrl.editObj.color);
				fd.append('CategoryTypeID', ctrl.categoryType.id);
				fd.append('Icon', ctrl.editObj.icon);
				fd.append('DisplayLayout', ctrl.editObj.selectedDisplay.id);
				fd.append('DeleteIconImage', ctrl.editObj.deleteIconImage);
				fd.append('IconImagePath', ctrl.editObj.iconImagePath);

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
		ctrl.updatePriority = function (s) {

			categoryService.updateCategoryPriority(s.id, s.priority).then(function (r) {
				toastr.success("บันทึกรายการสำเร็จ");
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

		ctrl.manageSubCategory = function (obj) {
			if (obj.displayLayout === 'DISPLAY_5') {
				$state.go('portal.downloadsubcategory', { obj: obj });
			}
		}

		// load data 
		ctrl.resetEditObj();
		ctrl.loadCategories();
		// ctr.resetDashboard_report();
	}

	angular.module("app").controller("DownloadSubCategory", ['$scope', '$http', '$stateParams', '$uibModal', 'toastr', 'authService', '$window', '$rootScope', '$sce', '$state', 'categoryService', 'storageService', 'Upload', 'appSetting', DownloadSubCategory]);
	function DownloadSubCategory($scope, $http, $stateParams, $uibModal, toastr, authService, $window, $rootScope, $sce, $state, categoryService, storageService, Upload, appSetting) {
		var ctrl = this;
		ctrl.state = 'add';
		ctrl.title = 'Add Subcategory';
		ctrl.categoryType = '';
		ctrl.categories = [];
		ctrl.status = ['Active', 'Inactive'];

		ctrl.categoryObj = $stateParams.obj;
		if ($stateParams.obj !== null) {
			storageService.setData('categoryObj', $stateParams.obj);
		}

		if (storageService.getData('categoryObj') !== null && storageService.getData('categoryObj') !== undefined) {
			ctrl.categoryObj = storageService.getData('categoryObj');
		}

		ctrl.editObj = null;
		ctrl.resetEditObj = function () {
			// alert(11);
			ctrl.editObj = {
				id: 0,
				name: null,
				status: 'Inactive',
				color: "",
				categoryID: ctrl.categoryObj.id
			};
		}
		ctrl.loadCategories = function () {
			categoryService.getSubCategories(ctrl.categoryObj.id).then(function (r) {
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

		ctrl.updateSubCategoryStatus = function (r) {
			categoryService.updateSubCategoryStatus(r.id, r.status).then(function (r) {
				toastr.success("บันทึกสำเร็จ");
				ctrl.loadCategories();
			}, function (err) {
				toastr.error(err.statusText, 'Error');
			})
		}
		ctrl.updateSubCategoryPriority = function (s) {

			categoryService.updateSubCategoryPriority(s.id, s.priority).then(function (r) {
				toastr.success("บันทึกรายการสำเร็จ");
				ctrl.loadCategories();
			}, function (err) {
				toastr.error(err.statusText + ':' + err.data, 'Error');
			});
		}

		ctrl.editCategory = function (s) {
			ctrl.state = 'edit';
			ctrl.title = 'Edit Subcategory';
			ctrl.editObj = angular.copy(s);
		}
		ctrl.cancelCategory = function () {
			ctrl.state = 'add';
			ctrl.title = 'Add Subcategory';
			ctrl.editObj = {
				id: 0,
				name: null,
				status: 'Inactive',
				categoryID: ctrl.categoryObj.id
			};
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
				}
				ctrl.processing = true;
				categoryService.saveSubCategory(ctrl.editObj).then(function (r) {
					toastr.success("บันทึกรายการสำเร็จ");
					ctrl.processing = false;
					if (ctrl.state == 'add') {
						ctrl.file = null;
						ctrl.resetEditObj();
					}
					$scope.frmCategory.$setPristine();
					$scope.frmCategory.$setUntouched();
					ctrl.loadCategories();
				}, function (err) {
					ctrl.processing = false;
					toastr.error(err.statusText + ':' + err.data, 'Error');
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
								categoryID: v.categoryID
							});
						}
					});
					if (delObjs.length > 0) {

						categoryService.deleteSubCategory(delObjs).then(function (r) {
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

		ctrl.goto = function (sel) {
			if (sel === 'Dashboard') {
				$state.go('portal.dashboard');
			}
			else if (sel === 'DownloadCategory') {
				$state.go('portal.downloadcategory');
			}
		}

		// load data 
		ctrl.resetEditObj();
		ctrl.loadCategories();
	}
})();