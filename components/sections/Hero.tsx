'use client';

import Link from 'next/link';
import { ArrowRight, Play } from 'lucide-react';

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Video Background */}
      <div className="absolute inset-0 z-0">
        {/* Video element */}
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
          poster="/hero-poster.jpg"
        >
          <source src="/hero-video.mp4" type="video/mp4" />
          <source src="/hero-video.webm" type="video/webm" />
          {/* Fallback gradient if video doesn't load */}
        </video>
        
        {/* Fallback gradient (shown if video not loaded) */}
        <div className="absolute inset-0 bg-gradient-to-br from-black via-purple-900/20 to-black">
          <div className="absolute inset-0 opacity-30"
               style={{
                 backgroundImage: `radial-gradient(circle at 20% 50%, rgba(168, 85, 247, 0.15) 0%, transparent 50%),
                                  radial-gradient(circle at 80% 80%, rgba(212, 175, 55, 0.15) 0%, transparent 50%)`
               }}
          />
        </div>
        
        {/* Video overlay for better text readability */}
        <div className="absolute inset-0 bg-black/60" />
      </div>

      {/* Content */}
      <div className="relative z-20 container mx-auto px-4 text-center">
        <div className="max-w-5xl mx-auto space-y-8">
          {/* Badge */}
          <div className="inline-flex items-center space-x-2 px-4 py-2 glass rounded-full border border-accent-500/30">
            <div className="w-2 h-2 bg-accent-500 rounded-full animate-pulse" />
            <span className="text-sm text-gray-200">AI • Видео • Метавселенные</span>
          </div>

          {/* Main Heading */}
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-display font-bold leading-tight">
            <span className="block">Видеопродакшн будущего</span>
            <span className="block mt-2">
              <span className="bg-gradient-to-r from-primary-400 via-accent-400 to-primary-400 bg-clip-text text-transparent">
                и иммерсивные технологии
              </span>
            </span>
          </h1>

          {/* Description */}
          <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Создаем рекламные AI-ролики, VR-тренажеры и 3D-графику для бизнеса.<br />
            От идеи до релиза за 2 недели.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6">
            <Link
              href="/portfolio"
              className="group px-8 py-4 bg-gradient-to-r from-primary-600 to-accent-600 rounded-full text-white font-semibold text-lg flex items-center space-x-3 hover:shadow-2xl hover:shadow-purple-500/50 transition-all hover:scale-105"
            >
              <Play className="w-6 h-6 fill-white" />
              <span>Смотреть шоурил</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/contact"
              className="group px-8 py-4 border-2 border-accent-500/50 rounded-full text-white font-semibold text-lg hover:bg-accent-500/10 transition-all backdrop-blur-sm"
            >
              Начать проект
            </Link>
          </div>

          {/* Trust Indicators */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-16 max-w-4xl mx-auto">
            {[
              { value: '50+', label: 'Проектов' },
              { value: '30+', label: 'Клиентов' },
              { value: '5+', label: 'Лет опыта' },
              { value: 'R&D', label: 'Собственный' },
            ].map((stat) => (
              <div key={stat.label} className="group">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary-500/20 to-accent-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="relative glass-subtle rounded-2xl p-6 border border-white/5 hover:border-accent-500/30 transition-colors">
                    <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-accent-400 to-primary-400 bg-clip-text text-transparent">
                      {stat.value}
                    </div>
                    <div className="text-gray-400 mt-2 text-sm">{stat.label}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 animate-bounce">
        <div className="w-6 h-10 border-2 border-white/30 rounded-full flex items-start justify-center p-2">
          <div className="w-1 h-3 bg-white/50 rounded-full" />
        </div>
      </div>
    </section>
  );
}
