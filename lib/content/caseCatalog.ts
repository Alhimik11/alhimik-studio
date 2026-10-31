export type CaseCategory =
    | "VR / Обучение"
    | "AR / Ритейл"
    | "AI / Видео"
    | "BIM / Данные"
    | "WebGL / Витрина"
    | "XR / Культура"
    | "AI-контент"
    | "Инвестпроект / 3D"
    | "Архвиз / 3D";

export type ProjectCase = {
    id: string;          // Unique ID
    slug: string;        // URL slug for the detail page
    title: string;       // Display title
    category: CaseCategory; // Project category for portfolio
    summary: string;     // Short summary for cards
    focus: string;       // Focus keyword (used in service cards)

    // Portfolio 3D Specific
    imageUrl?: string;    // Image for the 3D tunnel
    modelUrl?: string;   // 3D Model URL for AR preview
    tags?: string[];     // Tags for the 3D tunnel details
    sceneId?: number;    // Live R3F scene shown on hover (placeholder cases only)

    // Detail Page Specific
    videoUrl?: string;   // Local video or external embed url
    fullDescription?: string; // Rich text or paragraphs for the detail page

    // Real case story (from the portfolio proposal, 09.2026)
    client?: string;     // Client and location
    task?: string;
    solution?: string;
    result?: string;
    gallery?: string[];  // Extra frames for the detail page
};

export const CASE_CATALOG: ProjectCase[] = [
    // --- REAL CASES (shown in the portfolio tunnel) ---
    {
        id: "real-01",
        slug: "amurskie-sezony",
        title: "Ярмарка «Амурские сезоны»",
        category: "Инвестпроект / 3D",
        client: "Благовещенск · инвестпроект Россия — Китай",
        summary: "Будущая ярмарка на набережной Благовещенска — до начала стройки: архитектура, территория и четыре сезона жизни.",
        focus: "ПОКАЗАТЬ ПРОЕКТ ДО СТРОЙКИ",
        imageUrl: "/images/cases/amurskie-sezony/sez_aerial_fair_c.jpg",
        tags: ["3D-анимация", "AI-персонажи", "Инфографика", "Озвучка", "1:24"],
        task: "Показать городу, инвесторам и партнёрам из КНР будущую ярмарку на набережной Благовещенска — площадку культурного обмена России и Китая — до начала стройки.",
        solution: "3D-модель комплекса по архитектурным решениям, схема территории с площадками и четыре сезона жизни ярмарки: каток, гуляния, мастер-классы, кафе. Персонажи и сцены — AI-генерация, встроенная в 3D-среду.",
        result: "Презентационный ролик 1:24 Full HD с дикторским текстом и инфографикой — для презентаций, СМИ и переговоров.",
        gallery: [
            "/images/cases/amurskie-sezony/sez_arch_green_c.jpg",
            "/images/cases/amurskie-sezony/sez_map.jpg",
            "/images/cases/amurskie-sezony/sez_skating_c.jpg",
            "/images/cases/amurskie-sezony/sez_women_c.jpg",
        ],
    },
    {
        id: "real-02",
        slug: "hehcir",
        title: "Спортивно-туристический комплекс «Хехцир»",
        category: "Инвестпроект / 3D",
        client: "Хабаровский край · 360 га",
        summary: "Концепт и визуализация круглогодичного курорта в 25 км от Хабаровска — когда территория ещё не размечена.",
        focus: "ПРЕЗЕНТАЦИЯ ИНВЕСТОРАМ",
        imageUrl: "/images/cases/hehcir/heh_night_slopes2_c.jpg",
        tags: ["Концепт", "3D-визуализация", "Генплан", "Зима и лето", "9:08"],
        task: "Показать инвесторам и краю будущий круглогодичный комплекс в 25 км от Хабаровска — горнолыжный курорт международного уровня, биатлонный стадион и туристическую инфраструктуру на 360 гектарах, когда территория ещё не размечена.",
        solution: "Концепт и 3D-визуализация всей территории: генплан трасс, гондольный подъёмник, биатлонный стадион, глэмпинги и кемпинги на видовых площадках, отель, амфитеатр, вело- и пешие маршруты. Зимний и летний сезоны — в одном фильме с дикторским текстом.",
        result: "Презентационный фильм 9:08 Full HD — для инвесторов, краевых презентаций и публичных показов концепции.",
        gallery: [
            "/images/cases/hehcir/heh_plan_c.jpg",
            "/images/cases/hehcir/heh_gondola.jpg",
            "/images/cases/hehcir/heh_domes.jpg",
            "/images/cases/hehcir/heh_stage.jpg",
        ],
    },
    {
        id: "real-03",
        slug: "sp-vostok",
        title: "Логистический центр СП «Восток»",
        category: "Инвестпроект / 3D",
        client: "ТОСЭР «Хабаровск» · логистика",
        summary: "Инвестиционный питч-ролик логистического комплекса на пересечении маршрутов в Китай, Москву и на Сахалин.",
        focus: "ПРИВЛЕЧЕНИЕ РЕЗИДЕНТОВ",
        imageUrl: "/images/cases/sp-vostok/spv_aerial.jpg",
        tags: ["3D-анимация", "CGI", "Инфографика", "Озвучка", "1:30"],
        task: "Привлечь резидентов и инвесторов в логистический комплекс на пересечении маршрутов в Китай, Москву, Сахалин, Ванино и Комсомольск-на-Амуре.",
        solution: "90-секундный ролик: аэропролёт над транспортными узлами, 3D-модель комплекса, CGI-переходы, инженерные сети и инфографика льгот ТОСЭР — 0% налога на прибыль на 5 лет, страховые взносы 7,6%.",
        result: "Инвестиционный питч-ролик с дикторским текстом — для переговоров, выставок и рассылки потенциальным резидентам.",
        gallery: [
            "/images/cases/sp-vostok/spv_map.jpg",
            "/images/cases/sp-vostok/spv_aerial2.jpg",
            "/images/cases/sp-vostok/spv_trucks.jpg",
        ],
    },
    {
        id: "real-04",
        slug: "gh-1095-main",
        title: "Ресторан GH · 1095 Main",
        category: "Архвиз / 3D",
        client: "Премиальный объект до открытия",
        summary: "Кинематографичный 3D-ролик ресторана премиум-класса: фасад, вход, лаунж на крыше и зал — когда здание ещё в проекте.",
        focus: "ПРЕЗЕНТАЦИЯ ВЛАДЕЛЬЦАМ И ПАРТНЁРАМ",
        imageUrl: "/images/cases/gh-1095-main/gh_entrance.jpg",
        tags: ["3D-анимация", "Фотореализм", "2.5K", "60 fps", "0:50"],
        task: "Показать владельцам и партнёрам будущий ресторан премиум-класса — фасад, вход, террасу и зал — в атмосфере вечернего сервиса, когда здание ещё в проекте.",
        solution: "Кинематографичный 3D-ролик: травертиновый фасад с логотипом, подъезд гостей, лаунж на крыше с очагами, сервировка и свет золотого часа. Материалы и освещение — фотореалистичные, камера — как в рекламе.",
        result: "Ролик 0:50 в разрешении 2.5K при 60 кадрах в секунду — для презентации проекта, сайта и соцсетей.",
        gallery: [
            "/images/cases/gh-1095-main/gh_fire.jpg",
            "/images/cases/gh-1095-main/gh_hall.jpg",
            "/images/cases/gh-1095-main/gh_entrance2.jpg",
            "/images/cases/gh-1095-main/gh_logo.jpg",
        ],
    },
    {
        id: "real-05",
        slug: "rck-khabarovsk",
        title: "Региональный центр компетенций Хабаровского края",
        category: "AI / Видео",
        client: "Нацпроект «Производительность труда»",
        summary: "Ролик для руководителей предприятий края: AI-сцены производства, 3D-инфографика и карта 45 участников.",
        focus: "ВОВЛЕЧЕНИЕ ПРЕДПРИЯТИЙ",
        imageUrl: "/images/cases/rck-khabarovsk/rck_workers.jpg",
        tags: ["AI-видео", "3D-инфографика", "Карта", "Озвучка", "2:12"],
        task: "Рассказать руководителям предприятий края о национальном проекте по производительности труда и убедить стать участником — цифрами, географией и результатами.",
        solution: "Двухминутный ролик: AI-сцены производства и семи видов потерь, 3D-инфографика — 60+ центров, 89 регионов, 6 000 предприятий, карта края с 45 участниками, результаты «до / после» и путь участника от диагностики до масштабирования.",
        result: "Ролик 2:12 Full HD с дикторским текстом — для конференций, встреч с предприятиями и соцсетей центра.",
        gallery: [
            "/images/cases/rck-khabarovsk/rck_russia89.jpg",
            "/images/cases/rck-khabarovsk/rck_31mlrd.jpg",
            "/images/cases/rck-khabarovsk/rck_plus10.jpg",
        ],
    },

    // --- PLACEHOLDER CASES (kept for service pages, hidden from the tunnel) ---
    {
        id: "port-01",
        slug: "vr-safety-trainer",
        title: "VR-тренажер промышленной безопасности",
        category: "VR / Обучение",
        summary: "Сценарное обучение персонала с системой оценки действий в реальном времени.",
        focus: "ОБУЧЕНИЕ И АТТЕСТАЦИЯ",
        sceneId: 1,
        modelUrl: "https://modelviewer.dev/shared-assets/models/Astronaut.glb",
        tags: ["Unity", "Realtime", "LMS"],
        videoUrl: "/videos/placeholder.mp4",
        fullDescription: "Детальный разбор проекта по созданию иммерсивного VR-тренажера для безопасной отработки аварийных сценариев на производстве.",
    },
    {
        id: "port-02",
        slug: "ar-ecommerce-configurator",
        title: "AR-конфигуратор для e-commerce",
        category: "AR / Ритейл",
        summary: "Размещение и примерка товара в пространстве клиента с выбором вариантов.",
        focus: "РОСТ КОНВЕРСИИ",
        sceneId: 2,
        modelUrl: "https://modelviewer.dev/shared-assets/models/RobotExpressive.glb",
        tags: ["WebXR", "USDZ", "iOS/Android"],
        videoUrl: "/videos/placeholder.mp4",
        fullDescription: "История разработки AR-конфигуратора, позволяющего покупателям примерять товары в своем интерьере прямо из браузера мобильного телефона.",
    },
    {
        id: "port-03",
        slug: "ai-ad-engine",
        title: "AI-движок рекламных материалов",
        category: "AI / Видео",
        summary: "Генерация концептов, кадров и роликов, связанных с маркетинговой аналитикой.",
        focus: "СКОРОСТЬ ТЕСТИРОВАНИЯ ГИПОТЕЗ",
        sceneId: 3,
        tags: ["ComfyUI", "After Effects", "Pipeline"],
        videoUrl: "/videos/placeholder.mp4",
        fullDescription: "Внедрение генеративных пайплайнов на базе ComfyUI для массового создания креативов под различные аудиторные сегменты.",
    },
    {
        id: "port-04",
        slug: "bim-digital-twin",
        title: "BIM-платформа цифрового двойника",
        category: "BIM / Данные",
        summary: "Единая BIM-экосистема для координации, проверок коллизий и отчетности.",
        focus: "УПРАВЛЕНИЕ СРОКАМИ",
        sceneId: 4,
        tags: ["Revit", "IFC", "Navisworks"],
        videoUrl: "/videos/placeholder.mp4",
        fullDescription: "Создание цифрового двойника инженерных систем для координации строительства и последующей эксплуатации здания.",
    },
    {
        id: "port-05",
        slug: "webgl-interactive-showroom",
        title: "Интерактивный цифровой шоурум",
        category: "WebGL / Витрина",
        summary: "Промо-сайт продукта с управляемыми материалами и кинематографичной камерой.",
        focus: "ПРЕЗЕНТАЦИЯ ПРОДУКТА",
        sceneId: 5,
        tags: ["Three.js", "GSAP", "R3F"],
        videoUrl: "/videos/placeholder.mp4",
        fullDescription: "Реализация WebGL-шоурума с плавными анимациями камеры, реалистичными материалами и интерактивным освещением для запуска нового продукта.",
    },
    {
        id: "port-06",
        slug: "xr-museum-installation",
        title: "XR-инсталляция для музея",
        category: "XR / Культура",
        summary: "Иммерсивный сценарий выставки с AR-слоями, сенсорным интерактивом и звуком.",
        focus: "ВОВЛЕЧЕНИЕ АУДИТОРИИ",
        sceneId: 6,
        modelUrl: "https://modelviewer.dev/shared-assets/models/NeilArmstrong.glb",
        tags: ["Spatial Audio", "WebGL", "Projection"],
        videoUrl: "/videos/placeholder.mp4",
        fullDescription: "Смешанная реальность для выставочного пространства: от проекционного маппинга до пространственного звука и дополненной реальности в телефонах посетителей.",
    },

    // --- SERVICE CASES (Not in main 3D portfolio visual yet) ---

    // AR Services
    {
        id: "srv-ar-1",
        slug: "ar-furniture-fitting",
        title: "AR-конфигуратор мебели",
        category: "AR / Ритейл",
        summary: "Примерка размеров, материалов и цветов прямо в интерьере клиента.",
        focus: "РОСТ КОНВЕРСИИ",
        videoUrl: "/videos/placeholder.mp4",
    },
    {
        id: "srv-ar-2",
        slug: "ar-industrial-demo",
        title: "AR-демо промышленного оборудования",
        category: "AR / Ритейл",
        summary: "Показ устройства и ключевых узлов в реальном масштабе.",
        focus: "B2B-ПРЕЗЕНТАЦИИ",
        videoUrl: "/videos/placeholder.mp4",
    },
    {
        id: "srv-ar-3",
        slug: "ar-ecommerce-window",
        title: "AR-витрина для e-commerce",
        category: "AR / Ритейл",
        summary: "Быстрый просмотр 3D-товаров на мобильных устройствах без установки приложения.",
        focus: "МОБИЛЬНЫЙ ПУТЬ КЛИЕНТА",
        videoUrl: "/videos/placeholder.mp4",
    },

    // AI Services
    {
        id: "srv-ai-1",
        slug: "ai-performance-ads",
        title: "AI-ролики для performance-кампаний",
        category: "AI-контент",
        summary: "Серийное производство коротких видеокреативов под разные аудитории.",
        focus: "СКОРОСТЬ ТЕСТИРОВАНИЯ ГИПОТЕЗ",
        videoUrl: "/videos/placeholder.mp4",
    },
    {
        id: "srv-ai-2",
        slug: "ai-key-visuals",
        title: "Генеративные key visuals для бренда",
        category: "AI-контент",
        summary: "Система визуалов с контролируемым стилем для запусков и спецпроектов.",
        focus: "КОНСИСТЕНТНОСТЬ АЙДЕНТИКИ",
        videoUrl: "/videos/placeholder.mp4",
    },
    {
        id: "srv-ai-3",
        slug: "ai-social-pipeline",
        title: "Контент-пайплайн для соцсетей",
        category: "AI-контент",
        summary: "Автоматизация подготовки вариаций видео и графики для еженедельных релизов.",
        focus: "РЕГУЛЯРНОСТЬ И МАСШТАБ",
        videoUrl: "/videos/placeholder.mp4",
    },

    // BIM Services
    {
        id: "srv-bim-1",
        slug: "bim-complex-coordination",
        title: "BIM-координация комплекса",
        category: "BIM / Данные",
        summary: "Единая модель для архитекторов, инженеров и генподрядчика.",
        focus: "СОКРАЩЕНИЕ КОЛЛИЗИЙ",
        videoUrl: "/videos/placeholder.mp4",
    },
    {
        id: "srv-bim-2",
        slug: "bim-mep-twin",
        title: "Цифровой двойник инженерных систем",
        category: "BIM / Данные",
        summary: "Связка BIM-модели с эксплуатационными регламентами и журналами обслуживания.",
        focus: "ЭКСПЛУАТАЦИЯ ОБЪЕКТА",
        videoUrl: "/videos/placeholder.mp4",
    },
    {
        id: "srv-bim-3",
        slug: "bim-4d-viz",
        title: "BIM-визуализация этапов строительства",
        category: "BIM / Данные",
        summary: "4D-представление графика работ и контроль прогресса на площадке.",
        focus: "УПРАВЛЕНИЕ СРОКАМИ",
        videoUrl: "/videos/placeholder.mp4",
    }
];

export function getCaseBySlug(slug: string) {
    return CASE_CATALOG.find((project) => project.slug === slug);
}
