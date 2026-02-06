import { Metadata } from 'next';
import { Glasses, Video, Building2, Box, Check } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Услуги | Alhimik Studio',
  description: 'VR/AR/MR разработка, 3D-видео, архитектурная визуализация, BIM-проектирование',
};

const services = [
  {
    icon: Glasses,
    title: 'VR/AR/MR Приложения',
    description: 'Погружаем пользователей в интерактивные миры, обучаем через иммерсивный опыт и помогаем брендам выделиться.',
    features: [
      'VR-тренажеры и симуляторы',
      'AR-визуализация продуктов',
      'MR-приложения для коллаборации',
      'Интерактивные презентации',
      'Виртуальные выставки и шоурумы',
      'Обучающие VR-программы',
    ],
    technologies: ['Unity', 'Unreal Engine', 'ARKit', 'ARCore', 'WebXR', 'Oculus SDK'],
    gradient: 'from-blue-500 to-cyan-500',
  },
  {
    icon: Video,
    title: '3D Видео и Анимация',
    description: 'Оживляем идеи в динамичных визуальных историях — от рекламных видео до презентаций сложных продуктов.',
    features: [
      'Рекламные 3D-ролики',
      'Продуктовая анимация',
      'Архитектурные флайтру',
      'Технические визуализации',
      'Motion design',
      'Постпродакшн и композитинг',
    ],
    technologies: ['Cinema 4D', 'Blender', 'After Effects', 'Houdini', 'Redshift', 'Octane'],
    gradient: 'from-purple-500 to-pink-500',
  },
  {
    icon: Building2,
    title: 'Архитектурная Визуализация',
    description: 'Превращаем чертежи в фотореалистичные изображения и виртуальные туры для демонстрации проектов.',
    features: [
      'Экстерьеры зданий',
      'Интерьеры помещений',
      'Генпланы и благоустройство',
      'Виртуальные туры 360°',
      'Панорамные визуализации',
      'Интерактивные презентации',
    ],
    technologies: ['3ds Max', 'V-Ray', 'Corona', 'Lumion', 'Twinmotion', 'D5 Render'],
    gradient: 'from-orange-500 to-red-500',
  },
  {
    icon: Box,
    title: 'BIM-Проектирование',
    description: 'Создаем интеллектуальные 3D-модели зданий для оптимизации всех этапов строительства.',
    features: [
      '3D-моделирование зданий',
      'Информационное моделирование',
      'Координация разделов',
      'Clash Detection',
      'Управление данными проекта',
      'Эксплуатационная модель',
    ],
    technologies: ['Revit', 'ArchiCAD', 'BIM 360', 'Navisworks', 'Tekla', 'Solibri'],
    gradient: 'from-green-500 to-emerald-500',
  },
];

export default function ServicesPage() {
  return (
    <div className="pt-20">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-b from-black to-gray-900">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <h1 className="text-5xl md:text-6xl font-display font-bold">
              Наши <span className="gradient-text">услуги</span>
            </h1>
            <p className="text-xl text-gray-300">
              Полный спектр решений для визуализации, проектирования и создания иммерсивных технологий
            </p>
          </div>
        </div>
      </section>

      {/* Services Detail */}
      <section className="py-20 bg-black">
        <div className="container mx-auto px-4">
          <div className="space-y-20">
            {services.map((service, index) => {
              const Icon = service.icon;
              const isEven = index % 2 === 0;
              
              return (
                <div
                  key={service.title}
                  className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center ${
                    isEven ? '' : 'lg:flex-row-reverse'
                  }`}
                >
                  {/* Content */}
                  <div className={`space-y-6 ${isEven ? '' : 'lg:order-2'}`}>
                    <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${service.gradient} flex items-center justify-center`}>
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    
                    <h2 className="text-3xl md:text-4xl font-bold">{service.title}</h2>
                    <p className="text-xl text-gray-300">{service.description}</p>

                    {/* Features */}
                    <div>
                      <h3 className="text-lg font-semibold mb-4">Что мы делаем:</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {service.features.map((feature) => (
                          <div key={feature} className="flex items-start">
                            <Check className="w-5 h-5 text-primary-500 mr-2 flex-shrink-0 mt-0.5" />
                            <span className="text-gray-300">{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Technologies */}
                    <div>
                      <h3 className="text-lg font-semibold mb-4">Технологии:</h3>
                      <div className="flex flex-wrap gap-2">
                        {service.technologies.map((tech) => (
                          <span
                            key={tech}
                            className="px-4 py-2 glass rounded-full text-sm"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Visual */}
                  <div className={`${isEven ? '' : 'lg:order-1'}`}>
                    <div className={`glass rounded-3xl p-12 h-96 flex items-center justify-center bg-gradient-to-br ${service.gradient} bg-opacity-10`}>
                      <Icon className="w-32 h-32 text-white opacity-20" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-20 bg-gradient-to-b from-black to-gray-900">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-display font-bold mb-6">
              Как мы <span className="gradient-text">работаем</span>
            </h2>
            <p className="text-xl text-gray-300">
              Прозрачный процесс от идеи до реализации
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { step: '01', title: 'Консультация', description: 'Обсуждаем ваши цели и требования' },
              { step: '02', title: 'Концепция', description: 'Разрабатываем техническое задание и концепцию' },
              { step: '03', title: 'Реализация', description: 'Создаем проект с регулярными обновлениями' },
              { step: '04', title: 'Поддержка', description: 'Сопровождаем после запуска' },
            ].map((phase) => (
              <div key={phase.step} className="glass rounded-2xl p-6 text-center hover:bg-white/10 transition-all">
                <div className="text-5xl font-bold gradient-text mb-4">{phase.step}</div>
                <h3 className="text-xl font-bold mb-2">{phase.title}</h3>
                <p className="text-gray-400">{phase.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
