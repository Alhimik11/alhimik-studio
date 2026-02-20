export type CaseCategory = "VR / Обучение" | "AR / Ритейл" | "AI / Видео" | "BIM / Данные" | "WebGL / Витрина" | "XR / Культура" | "AI-контент";

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

    // Detail Page Specific
    videoUrl?: string;   // Local video or external embed url
    fullDescription?: string; // Rich text or paragraphs for the detail page
};

export const CASE_CATALOG: ProjectCase[] = [
    // --- 3D PORTFOLIO CASES ---
    {
        id: "port-01",
        slug: "vr-safety-trainer",
        title: "VR-тренажер промышленной безопасности",
        category: "VR / Обучение",
        summary: "Сценарное обучение персонала с системой оценки действий в реальном времени.",
        focus: "ОБУЧЕНИЕ И АТТЕСТАЦИЯ",
        imageUrl: "/images/portfolio/case-1.svg",
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
        imageUrl: "/images/portfolio/case-2.svg",
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
        imageUrl: "/images/portfolio/case-3.svg",
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
        imageUrl: "/images/portfolio/case-4.svg",
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
        imageUrl: "/images/portfolio/case-5.svg",
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
        imageUrl: "/images/portfolio/case-6.svg",
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
