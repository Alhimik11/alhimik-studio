import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Портфолио | Alhimik Studio',
  description: 'Наши работы: VR/AR проекты, 3D-визуализации, архитектурная визуализация, BIM',
};

const categories = ['Все', 'VR/AR', '3D Видео', 'Арх Виз', 'BIM'];

const projects = [
  {
    id: 1,
    title: 'VR-тренажер для промышленности',
    category: 'VR/AR',
    description: 'Интерактивный VR-тренажер для обучения работе с промышленным оборудованием. Реалистичная физика, пошаговое обучение, система оценки навыков.',
    image: '/images/portfolio/project-1.jpg',
    tags: ['Unity', 'VR', 'Обучение', 'C#'],
    client: 'Промышленная компания',
    year: '2024',
  },
  {
    id: 2,
    title: 'Архитектурная визуализация ЖК',
    category: 'Арх Виз',
    description: 'Полный комплект фотореалистичных визуализаций жилого комплекса: экстерьеры, интерьеры квартир, общественные зоны. Виртуальный тур 360°.',
    image: '/images/portfolio/project-2.jpg',
    tags: ['3ds Max', 'V-Ray', 'Photoshop', 'VR Tour'],
    client: 'Девелопер недвижимости',
    year: '2024',
  },
  {
    id: 3,
    title: '3D-анимация продукта',
    category: '3D Видео',
    description: 'Рекламный ролик с демонстрацией технологических особенностей продукта. Motion design, кинематографичные кадры, постпродакшн.',
    image: '/images/portfolio/project-3.jpg',
    tags: ['Cinema 4D', 'Redshift', 'After Effects'],
    client: 'Tech стартап',
    year: '2023',
  },
  {
    id: 4,
    title: 'BIM-модель торгового центра',
    category: 'BIM',
    description: 'Полная информационная модель здания торгового центра для управления строительством. Все разделы, clash detection, 4D-планирование.',
    image: '/images/portfolio/project-4.jpg',
    tags: ['Revit', 'BIM 360', 'Navisworks'],
    client: 'Строительная компания',
    year: '2024',
  },
  {
    id: 5,
    title: 'AR-приложение для мебели',
    category: 'VR/AR',
    description: 'Мобильное AR-приложение для визуализации мебели в интерьере покупателя. iOS и Android, интеграция с каталогом.',
    image: '/images/portfolio/project-5.jpg',
    tags: ['Unity', 'ARKit', 'ARCore', 'iOS', 'Android'],
    client: 'Мебельный ритейлер',
    year: '2023',
  },
  {
    id: 6,
    title: 'Архитектурный флайтру',
    category: '3D Видео',
    description: 'Эффектный флайтру по проектируемому кампусу университета с демонстрацией архитектурных решений и благоустройства.',
    image: '/images/portfolio/project-6.jpg',
    tags: ['Lumion', 'After Effects', 'Premiere Pro'],
    client: 'Архитектурное бюро',
    year: '2023',
  },
];

export default function PortfolioPage() {
  return (
    <div className="pt-20">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-b from-black to-gray-900">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <h1 className="text-5xl md:text-6xl font-display font-bold">
              Наше <span className="gradient-text">портфолио</span>
            </h1>
            <p className="text-xl text-gray-300">
              Избранные проекты, демонстрирующие наши технологии и экспертизу
            </p>
          </div>
        </div>
      </section>

      {/* Portfolio Grid */}
      <section className="py-20 bg-black">
        <div className="container mx-auto px-4">
          {/* Category Filter */}
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {categories.map((category) => (
              <button
                key={category}
                className="px-6 py-2 glass rounded-full hover:bg-white/10 transition-all"
              >
                {category}
              </button>
            ))}
          </div>

          {/* Projects Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project, index) => (
              <div
                key={project.id}
                className="group glass rounded-2xl overflow-hidden hover:bg-white/10 transition-all duration-300"
                style={{
                  animationDelay: `${index * 100}ms`,
                }}
              >
                {/* Image */}
                <div className="relative h-64 bg-gradient-to-br from-primary-900/20 to-accent-900/20 overflow-hidden">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-6xl opacity-20">🎨</div>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />
                  
                  {/* Category Badge */}
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 glass rounded-full text-sm font-medium">
                      {project.category}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 space-y-4">
                  <div>
                    <h3 className="text-xl font-bold mb-2 group-hover:text-primary-400 transition-colors">
                      {project.title}
                    </h3>
                    <p className="text-gray-400 text-sm line-clamp-3">{project.description}</p>
                  </div>

                  {/* Meta */}
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <span>{project.client}</span>
                    <span>{project.year}</span>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2">
                    {project.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-1 bg-white/5 rounded text-xs text-gray-400"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Load More */}
          <div className="text-center mt-12">
            <button className="px-8 py-4 glass rounded-full hover:bg-white/10 transition-all">
              Загрузить еще
            </button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-b from-black to-gray-900">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto glass rounded-3xl p-12 text-center space-y-6">
            <h2 className="text-4xl md:text-5xl font-display font-bold">
              Хотите увидеть больше?
            </h2>
            <p className="text-xl text-gray-300">
              Свяжитесь с нами, чтобы обсудить ваш проект и посмотреть релевантные кейсы
            </p>
            <button className="px-8 py-4 bg-gradient-to-r from-primary-500 to-accent-500 rounded-full text-white font-medium hover:shadow-lg hover:shadow-primary-500/50 transition-all">
              Связаться
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
