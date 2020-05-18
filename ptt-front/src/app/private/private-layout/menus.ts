export const menu = [
  {
    class: "1",
    dataRote: ["/home/highlight"],
    id: "menu-1",
    //click: this.selectRoot("hightlight"),
    src: "assets/images/menu-1.png",
    text: "Home",
    child: false,
    download: false,
    active: false
  },
  {
    class: "2",
    dataRote: ["/home/about-sm/overview/1"],
    //dataRote: ["/home/about-sm/overview/5"],
    id: "menu-2",
    //click: this.selectRoot('about-sm'),
    src: "assets/images/menu-2.png",
    text: "About SM",
    child: true,
    getchild: "about-sm",
    download: false,
    active: false
  },
  {
    class: "3",
    dataRote: ["/home/applications"],
    id: "menu-3",
    //click: this.selectRoot('applications'),
    src: "assets/images/menu-3.png",
    text: "Applications",
    child: false,
    getchild: "about-sm",
    download: false,
    active: false
  },
  {
    class: "4",
    dataRote: ["/home/news"],
    id: "menu-4",
    //click: this.selectRoot("news"),
    src: "assets/images/menu-4.png",
    text: "News",
    child: true,
    getchild: "news",
    download: false,
    active: false
  },
  {
    class: "5",
    dataRote: ["/home/policy-and-target"],
    id: "menu-5",
    //click: this.selectRoot("policy-and-target"),
    src: "assets/images/menu-5.png",
    text: "Policy and Target",
    child: true,
    getchild: "policy-and-target",
    download: false,
    active: false
  },
  {
    class: "6",
    dataRote: ["/home/download"],
    id: "menu-6",
    //click: this.selectRoot("download"),
    src: "assets/images/menu-6.png",
    text: "Download",
    child: true,
    getchild: "download",
    download: false,
    active: false
  }, {
    class: "7",
    dataRote: "",
    id: "menu-8",
    //click: this.selectRoot("dashboard"),
    src: "assets/images/dashboard.png",
    text: "Dashboard",
    child: true,
    download: false,
    active: false,
    getchild: "dashboard"
  },
  {
    class: "8",
    dataRote: ["/home/contact-us"],
    id: "menu-7",
    //click: this.selectRoot("contact-us"),
    src: "assets/images/menu-7.png",
    text: "Contact Us",
    child: true,
    download: false,
    active: false,
    getchild: "contact"
  },

]
export const contactMenu = [
  {
    class: "1",
    dataRote: ["/home/contact-us/contact-form"],
    id: "menu-1-1",
    //click: this.selectRoot("hightlight"),
    src: "assets/images/menu-7.png",
    text: "Contact Form",
    child: false,
    download: false,
    active: false
  },
  {
    class: "2",
    dataRote: ["/home/contact-us/faq"],
    //dataRote: ["/home/about-sm/overview/5"],
    id: "menu-2",
    //click: this.selectRoot('about-sm'),
    src: "assets/images/contactus-2.png",
    text: "FAQS",
    child: false,
    download: false,
    active: false
  },
]
