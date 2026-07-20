import {
    useEffect,
    useState,
} from "react";

import {
    Link,
    useLocation,
} from "react-router-dom";

import {
    LayoutDashboard,
    Users,
    UserRoundCheck,
    CreditCard,
    Archive,
    Settings,
    ChevronDown,
    ChevronRight,
    Menu,
} from "lucide-react";

const logo =
    "/images/LogoSchool.png";

const translations = {
    EN: {
        dashboard: "Dashboard",

        usersManagement:
            "Academic Members",

        students: "Students",
        teachers: "Teachers",

        paymentManagement:
            "Finance",

        payments: "Payments",

        archivedPayments:
            "Archived Payments",

        settings: "Settings",
    },

    FR: {
        dashboard:
            "Tableau de bord",

        usersManagement:
            "Gestion des utilisateurs",

        students: "Étudiants",
        teachers: "Enseignants",

        paymentManagement:
            "Gestion des paiements",

        payments: "Paiements",

        archivedPayments:
            "Paiements archivés",

        settings: "Paramètres",
    },

    AR: {
        dashboard:
            "لوحة التحكم",

        usersManagement:
            "إدارة المستخدمين",

        students: "الطلاب",
        teachers: "الأساتذة",

        paymentManagement:
            "إدارة المدفوعات",

        payments: "المدفوعات",

        archivedPayments:
            "المدفوعات المؤرشفة",

        settings: "الإعدادات",
    },
};

const menuPaths = {
    users: [
        "/manager/students",
        "/manager/teachers",
    ],

    payments: [
        "/manager/payments",
        "/manager/payments/archive",
    ],
};

export default function ManagerSidebar({
    collapsed,
    setCollapsed,
}) {
    const { pathname } =
        useLocation();

    const [language, setLanguage] =
        useState(
            localStorage.getItem(
                "app-language"
            ) || "EN"
        );

    const [
        openMenus,
        setOpenMenus,
    ] = useState({
        users: false,
        payments: false,
    });

    const t =
        translations[language] ||
        translations.EN;

    useEffect(() => {
        const handleLanguageChange = (
            event
        ) => {
            const nextLanguage =
                event.detail ||
                localStorage.getItem(
                    "app-language"
                ) ||
                "EN";

            setLanguage(nextLanguage);
        };

        window.addEventListener(
            "app-language-change",
            handleLanguageChange
        );

        return () => {
            window.removeEventListener(
                "app-language-change",
                handleLanguageChange
            );
        };
    }, []);

    useEffect(() => {
        const usersMenuIsActive =
            menuPaths.users.some(
                (path) =>
                    pathname === path ||
                    pathname.startsWith(
                        `${path}/`
                    )
            );

        const paymentsMenuIsActive =
            menuPaths.payments.some(
                (path) =>
                    pathname === path ||
                    pathname.startsWith(
                        `${path}/`
                    )
            );

        setOpenMenus({
            users:
                usersMenuIsActive,

            payments:
                paymentsMenuIsActive,
        });
    }, [pathname]);

    const toggleMenu = (
        menuName
    ) => {
        if (collapsed) {
            setCollapsed(false);

            setOpenMenus({
                users:
                    menuName ===
                    "users",

                payments:
                    menuName ===
                    "payments",
            });

            return;
        }

        setOpenMenus(
            (previous) => {
                const shouldOpen =
                    !previous[
                        menuName
                    ];

                return {
                    users:
                        menuName ===
                        "users"
                            ? shouldOpen
                            : false,

                    payments:
                        menuName ===
                        "payments"
                            ? shouldOpen
                            : false,
                };
            }
        );
    };

    const toggleSidebar = () => {
        setCollapsed(
            (previous) =>
                !previous
        );
    };

    const isPathActive = (
        path
    ) => {
        if (
            path === "/manager"
        ) {
            return (
                pathname ===
                "/manager"
            );
        }

        return (
            pathname === path ||
            pathname.startsWith(
                `${path}/`
            )
        );
    };

    const activeStyle =
        "bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-lg shadow-orange-500/30";

    const itemClass = (
        path
    ) => {
        return `
            flex items-center gap-3
            rounded-2xl px-4 py-3
            transition-all duration-300
            ${
                isPathActive(path)
                    ? activeStyle
                    : "text-white hover:bg-white/10 hover:text-orange-200"
            }
            ${
                collapsed
                    ? "justify-center"
                    : ""
            }
        `;
    };

    const buttonClass = (
        isOpen
    ) => {
        return `
            flex w-full items-center
            justify-between
            rounded-2xl px-4 py-3
            transition-all duration-300
            ${
                isOpen
                    ? activeStyle
                    : "text-white hover:bg-white/10 hover:text-orange-200"
            }
        `;
    };

    const subItemClass = (
        path
    ) => {
        return `
            flex items-center gap-4
            rounded-xl px-4 py-3
            text-sm
            transition-all duration-300
            ${
                isPathActive(path)
                    ? "bg-white/15 font-semibold text-white"
                    : "text-orange-100 hover:bg-white/10 hover:text-white"
            }
        `;
    };

    const renderChevron = (
        isOpen
    ) => {
        return isOpen ? (
            <ChevronDown
                size={18}
            />
        ) : (
            <ChevronRight
                size={18}
            />
        );
    };

    return (
        <aside
            dir={
                language === "AR"
                    ? "rtl"
                    : "ltr"
            }
            className={`
                sticky top-0 z-20
                flex h-screen shrink-0
                flex-col
                transition-all
                duration-300
                ${
                    collapsed
                        ? "w-20"
                        : "w-72"
                }
            `}
            style={{
                background:
                    "linear-gradient(180deg, #c2410c 0%, #9a3412 52%, #431407 100%)",

                color: "white",
            }}
        >
            {/* HEADER */}
            <div
                className={`
                    flex items-center p-5
                    ${
                        collapsed
                            ? "justify-center"
                            : "justify-between"
                    }
                `}
            >
                {!collapsed && (
                    <img
                        src={logo}
                        alt="School logo"
                        className="
                            w-44
                            object-contain
                            brightness-0
                            invert
                        "
                    />
                )}

                <button
                    type="button"
                    onClick={
                        toggleSidebar
                    }
                    className="
                        rounded-xl p-2
                        transition
                        hover:bg-white/10
                    "
                    aria-label={
                        collapsed
                            ? "Agrandir le menu"
                            : "Réduire le menu"
                    }
                    title={
                        collapsed
                            ? "Agrandir le menu"
                            : "Réduire le menu"
                    }
                >
                    <Menu
                        size={22}
                    />
                </button>
            </div>

            {/* MENU */}
            <div
                className="
                    custom-scrollbar
                    flex-1
                    space-y-3
                    overflow-y-auto
                    p-3
                "
            >
                {/* DASHBOARD */}
                <Link
                    to="/manager"
                    className={
                        itemClass(
                            "/manager"
                        )
                    }
                    title={
                        collapsed
                            ? t.dashboard
                            : undefined
                    }
                >
                    <LayoutDashboard
                        size={20}
                    />

                    {!collapsed && (
                        <span>
                            {
                                t.dashboard
                            }
                        </span>
                    )}
                </Link>

                {/* UTILISATEURS */}
                <div>
                    <button
                        type="button"
                        onClick={() =>
                            toggleMenu(
                                "users"
                            )
                        }
                        className={
                            buttonClass(
                                openMenus.users
                            )
                        }
                        title={
                            collapsed
                                ? t.usersManagement
                                : undefined
                        }
                    >
                        <div
                            className={`
                                flex
                                items-center
                                gap-3
                                ${
                                    collapsed
                                        ? "w-full justify-center"
                                        : ""
                                }
                            `}
                        >
                            <Users
                                size={20}
                            />

                            {!collapsed && (
                                <span>
                                    {
                                        t.usersManagement
                                    }
                                </span>
                            )}
                        </div>

                        {!collapsed &&
                            renderChevron(
                                openMenus.users
                            )}
                    </button>

                    {openMenus.users &&
                        !collapsed && (
                            <div
                                className="
                                    mt-3
                                    space-y-2
                                    border-white/10
                                    px-4
                                    ltr:ml-6
                                    ltr:border-l
                                    rtl:mr-6
                                    rtl:border-r
                                "
                            >
                                <Link
                                    to="/manager/students"
                                    className={
                                        subItemClass(
                                            "/manager/students"
                                        )
                                    }
                                >
                                    <Users
                                        size={18}
                                    />

                                    <span>
                                        {
                                            t.students
                                        }
                                    </span>
                                </Link>

                                <Link
                                    to="/manager/teachers"
                                    className={
                                        subItemClass(
                                            "/manager/teachers"
                                        )
                                    }
                                >
                                    <UserRoundCheck
                                        size={18}
                                    />

                                    <span>
                                        {
                                            t.teachers
                                        }
                                    </span>
                                </Link>
                            </div>
                        )}
                </div>

                {/* PAIEMENTS */}
                <div>
                    <button
                        type="button"
                        onClick={() =>
                            toggleMenu(
                                "payments"
                            )
                        }
                        className={
                            buttonClass(
                                openMenus.payments
                            )
                        }
                        title={
                            collapsed
                                ? t.paymentManagement
                                : undefined
                        }
                    >
                        <div
                            className={`
                                flex
                                items-center
                                gap-3
                                ${
                                    collapsed
                                        ? "w-full justify-center"
                                        : ""
                                }
                            `}
                        >
                            <CreditCard
                                size={20}
                            />

                            {!collapsed && (
                                <span>
                                    {
                                        t.paymentManagement
                                    }
                                </span>
                            )}
                        </div>

                        {!collapsed &&
                            renderChevron(
                                openMenus.payments
                            )}
                    </button>

                    {openMenus.payments &&
                        !collapsed && (
                            <div
                                className="
                                    mt-3
                                    space-y-2
                                    border-white/10
                                    px-4
                                    ltr:ml-6
                                    ltr:border-l
                                    rtl:mr-6
                                    rtl:border-r
                                "
                            >
                                <Link
                                    to="/manager/payments"
                                    className={
                                        subItemClass(
                                            "/manager/payments"
                                        )
                                    }
                                >
                                    <CreditCard
                                        size={18}
                                    />

                                    <span>
                                        {
                                            t.payments
                                        }
                                    </span>
                                </Link>

                                <Link
                                    to="/manager/payments/archive"
                                    className={
                                        subItemClass(
                                            "/manager/payments/archive"
                                        )
                                    }
                                >
                                    <Archive
                                        size={18}
                                    />

                                    <span>
                                        {
                                            t.archivedPayments
                                        }
                                    </span>
                                </Link>
                            </div>
                        )}
                </div>
            </div>

            {/* FOOTER */}
            <div className="p-3">
                <Link
                    to="/manager/settings"
                    className={
                        itemClass(
                            "/manager/settings"
                        )
                    }
                    title={
                        collapsed
                            ? t.settings
                            : undefined
                    }
                >
                    <Settings
                        size={20}
                    />

                    {!collapsed && (
                        <span>
                            {
                                t.settings
                            }
                        </span>
                    )}
                </Link>
            </div>
        </aside>
    );
}

