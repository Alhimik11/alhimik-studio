'use client';

import Link from 'next/link';
import { ArrowRight, Mail, MessageSquare } from 'lucide-react';

export function CTA() {
  return (
    <section className="py-20 bg-black relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto">
          {/* Main CTA Card */}
          <div className="glass rounded-3xl p-12 text-center space-y-8">
            <div className="space-y-4">
              <h2 className="text-4xl md:text-5xl font-display font-bold">
                Готовы начать <span className="gradient-text">свой проект</span>?
              </h2>
              <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                Давайте обсудим, как VR, AR, 3D или BIM могут стать вашим конкурентным преимуществом
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/contact"
                className="group px-8 py-4 bg-gradient-to-r from-primary-500 to-accent-500 rounded-full text-white font-medium flex items-center space-x-2 hover:shadow-lg hover:shadow-primary-500/50 transition-all"
              >
                <Mail className="w-5 h-5" />
                <span>Связаться с нами</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <a
                href="tel:+79999999999"
                className="group px-8 py-4 glass rounded-full text-white font-medium flex items-center space-x-2 hover:bg-white/10 transition-all"
              >
                <MessageSquare className="w-5 h-5" />
                <span>Позвонить</span>
              </a>
            </div>

            {/* Features Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-8">
              {[
                {
                  title: 'Быстрый ответ',
                  description: 'Отвечаем в течение 24 часов',
                },
                {
                  title: 'Бесплатная консультация',
                  description: 'Обсудим ваш проект и подберем решение',
                },
                {
                  title: 'Гибкий подход',
                  description: 'Адаптируем технологии под ваши задачи',
                },
              ].map((feature) => (
                <div key={feature.title} className="space-y-2">
                  <h3 className="font-semibold">{feature.title}</h3>
                  <p className="text-sm text-gray-400">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
            {[
              { value: '24/7', label: 'Поддержка' },
              { value: '100+', label: 'Технологий' },
              { value: '5 лет', label: 'На рынке' },
              { value: '∞', label: 'Возможностей' },
            ].map((stat) => (
              <div key={stat.label} className="glass rounded-xl p-4 text-center hover:bg-white/10 transition-colors">
                <div className="text-2xl font-bold gradient-text">{stat.value}</div>
                <div className="text-sm text-gray-400 mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
