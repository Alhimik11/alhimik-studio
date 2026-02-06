'use client';

import Link from 'next/link';
import { ArrowRight, ExternalLink } from 'lucide-react';

const projects = [
  {
    title: 'VR-тренажер для промышленности',
    category: 'VR/AR',
    description: 'Интерактивный VR-тренажер для обучения работе с промышленным оборудованием',
    image: '/images/portfolio/project-1.jpg',
    tags: ['Unity', 'VR', 'Обучение'],
  },
  {
    title: 'Архитектурная визуализация ЖК',
    category: 'Арх Виз',
    description: 'Фотореалистичные визуализации и виртуальный тур по жилому комплексу',
    image: '/images/portfolio/project-2.jpg',
    tags: ['3ds Max', 'V-Ray', 'VR Tour'],
  },
  {
    title: '3D-анимация продукта',
    category: '3D Видео',
    description: 'Рекламный ролик с демонстрацией технологических особенностей продукта',
    image: '/images/portfolio/project-3.jpg',
    tags: ['Cinema 4D', 'After Effects'],
  },
  {
    title: 'BIM-модель торгового центра',
    category: 'BIM',
    description: 'Полная информационная модель здания для управления строительством',
    image: '/images/portfolio/project-4.jpg',
    tags: ['Revit', 'BIM 360', 'Navisworks'],
  },
];

export function Portfolio() {
  return (
    <section className="py-20 bg-gradient-to-b from-gray-900 to-black">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-4xl md:text-5xl font-display font-bold mb-6">
            Наши <span className="gradient-text">работы</span>
          </h2>
          <p className="text-xl text-gray-300">
            Избранные проекты, демонстрирующие наши возможности
          </p>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {projects.map((project, index) => (
            <div
              key={project.title}
              className="group relative glass rounded-2xl overflow-hidden hover:bg-white/10 transition-all duration-300"
              style={{
                animationDelay: `${index * 100}ms`,
              }}
            >
              {/* Image Placeholder */}
              <div className="relative h-64 bg-gradient-to-br from-primary-900/20 to-accent-900/20 overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-6xl opacity-20">🎨</div>
                </div>
                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />
                
                {/* Category Badge */}
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 glass rounded-full text-sm font-medium">
                    {project.category}
                  </span>
                </div>

                {/* View Button */}
                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button className="w-10 h-10 glass rounded-full flex items-center justify-center hover:bg-white/20 transition-colors">
                    <ExternalLink className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2 group-hover:text-primary-400 transition-colors">
                  {project.title}
                </h3>
                <p className="text-gray-400 mb-4">{project.description}</p>

                {/* Tags */}
                <div className="flex flex-wrap gap-2">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 bg-white/5 rounded-full text-xs text-gray-400"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center">
          <Link
            href="/portfolio"
            className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-primary-500 to-accent-500 rounded-full text-white font-medium hover:shadow-lg hover:shadow-primary-500/50 transition-all group"
          >
            <span>Смотреть все проекты</span>
            <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  );
}
