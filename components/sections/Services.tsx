'use client';

import Link from 'next/link';
import { Glasses, Video, Building2, Box, ArrowRight } from 'lucide-react';

const services = [
  {
    icon: Glasses,
    title: 'VR/AR/MR',
    description: 'Создаем уникальные приложения виртуальной, дополненной и смешанной реальности для интерактивных презентаций и обучающих симуляторов.',
    features: ['Обучающие VR-симуляторы', 'AR-визуализация продуктов', 'MR-коллаборация'],
    gradient: 'from-blue-500 to-cyan-500',
  },
  {
    icon: Video,
    title: '3D Видео',
    description: 'Оживляем идеи в динамичных визуальных историях — от рекламных видео до презентаций сложных продуктов.',
    features: ['Рекламные ролики', 'Продуктовая анимация', 'Презентации проектов'],
    gradient: 'from-purple-500 to-pink-500',
  },
  {
    icon: Building2,
    title: 'Архитектурная визуализация',
    description: 'Превращаем чертежи в фотореалистичные изображения и виртуальные туры, чтобы вы могли пройти по проекту до его реализации.',
    features: ['Экстерьеры и интерьеры', 'Виртуальные туры', 'Презентации объектов'],
    gradient: 'from-orange-500 to-red-500',
  },
  {
    icon: Box,
    title: 'BIM-проектирование',
    description: 'Создаем интеллектуальные 3D-модели зданий, оптимизируя строительство и управление объектами на всех этапах.',
    features: ['3D-моделирование зданий', 'Управление данными', 'Оптимизация процессов'],
    gradient: 'from-green-500 to-emerald-500',
  },
];

export function Services() {
  return (
    <section id="services" className="py-20 bg-gradient-to-b from-black to-gray-900">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-4xl md:text-5xl font-display font-bold mb-6">
            Наши <span className="gradient-text">услуги</span>
          </h2>
          <p className="text-xl text-gray-300">
            Полный спектр решений для визуализации и проектирования будущего
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <div
                key={service.title}
                className="group relative glass rounded-2xl p-8 hover:bg-white/10 transition-all duration-300"
                style={{
                  animationDelay: `${index * 100}ms`,
                }}
              >
                {/* Icon */}
                <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${service.gradient} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                  <Icon className="w-8 h-8 text-white" />
                </div>

                {/* Content */}
                <h3 className="text-2xl font-bold mb-4">{service.title}</h3>
                <p className="text-gray-300 mb-6">{service.description}</p>

                {/* Features */}
                <ul className="space-y-2 mb-6">
                  {service.features.map((feature) => (
                    <li key={feature} className="flex items-center text-gray-400">
                      <div className={`w-1.5 h-1.5 rounded-full bg-gradient-to-r ${service.gradient} mr-3`} />
                      {feature}
                    </li>
                  ))}
                </ul>

                {/* Learn More Link */}
                <Link
                  href="/services"
                  className="inline-flex items-center text-primary-400 hover:text-primary-300 transition-colors group/link"
                >
                  <span>Узнать больше</span>
                  <ArrowRight className="w-4 h-4 ml-2 group-hover/link:translate-x-1 transition-transform" />
                </Link>

                {/* Hover Effect */}
                <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${service.gradient} opacity-0 group-hover:opacity-10 transition-opacity -z-10`} />
              </div>
            );
          })}
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <Link
            href="/services"
            className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-primary-500 to-accent-500 rounded-full text-white font-medium hover:shadow-lg hover:shadow-primary-500/50 transition-all"
          >
            <span>Все услуги</span>
            <ArrowRight className="w-5 h-5 ml-2" />
          </Link>
        </div>
      </div>
    </section>
  );
}
