
export const navigation = [
    {
        name: "Dashboard",
        path: "/dash/",
        allowedRoles: ["admin", "team_leader"],
        icon: "RxDashboard"
    },
    {
        name: "Academic",
        allowedRoles: ["admin", "instructor", "team_leader", "sales"], // Parent visibility based on children
        icon: "HiAcademicCap",
        children: [
            {
                name: "My Groups",
                path: "/dash/groups",
                allowedRoles: ["instructor"],
                icon: "HiUserGroup"
            },
            {
                name: "Assignments",
                path: "/dash/pending-assignments",
                allowedRoles: ["instructor"],
                icon: "HiClipboardDocumentList"
            },
            {
                name: "Courses",
                path: "/dash/courses",
                allowedRoles: ["admin"],
                icon: "HiBookOpen"
            },
            {
                name: "Free Tests",
                path: "/dash/free-tests",
                allowedRoles: ["admin", "team_leader", "sales"],
                icon: "HiClipboardDocumentList"
            },
            {
                name: "Free Sessions",
                path: "/dash/free-sessions",
                allowedRoles: ["admin"],
                icon: "HiCalendarDays"
            },
        ]
    },
    {
        name: "Management",
        allowedRoles: ["admin", "team_leader", "sales"],
        icon: "RxCalendar",
        children: [
            {
                name: "Booking",
                path: "/dash/booking",
                allowedRoles: ["admin", "team_leader", "sales"],
                icon: "HiCalendarDays"
            },
            {
                name: "Groups",
                path: "/dash/groups",
                allowedRoles: ["admin"],
                icon: "HiUserGroup"
            },
            {
                name: "Students",
                path: "/dash/users",
                allowedRoles: ["admin"],
                icon: "MdPersonOutline"
            },
            {
                name: "Payments",
                path: "/dash/payment",
                allowedRoles: ["admin"],
                icon: "RxCalendar"
            },
            {
                name: "Affiliate",
                path: "/dash/affiliate-settings",
                allowedRoles: ["admin"],
                icon: "HiClipboardDocumentList"
            },
        ]
    },
    {
        name: "Content",
        allowedRoles: ["admin", "seo"],
        icon: "GiPapers",
        children: [
            {
                name: "Pages",
                path: "/dash/pages",
                allowedRoles: ["admin", "seo"],
                icon: "GiPapers"
            }
        ]
    },
    {
        name: "Finance",
        allowedRoles: ["admin", "accountant"],
        icon: "HiCurrencyDollar",
        children: [
            {
                name: "Revenues",
                path: "/dash/finance/revenues",
                allowedRoles: ["admin", "accountant"],
                icon: "HiArrowTrendingUp"
            },
            {
                name: "Expenses",
                path: "/dash/finance/expenses",
                allowedRoles: ["admin", "accountant"],
                icon: "HiArrowTrendingUp"
            },
            {
                name: "Payroll",
                path: "/dash/finance/payroll",
                allowedRoles: ["admin", "accountant"],
                icon: "HiCurrencyDollar"
            },
        ]
    },
    {
        name: "Settings",
        path: "/dash/settings",
        allowedRoles: ["admin"],
        icon: "CiSettings"
    },
];
