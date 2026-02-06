'use client';

import { useState } from 'react';
import { Mail, Phone, MapPin, Send, MessageSquare, Clock } from 'lucide-react';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    service: '',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically send the form data to your backend
    console.log('Form submitted:', formData);
    alert('Спасибо за обращение! Мы свяжемся с вами в ближайшее время.');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="pt-20">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-b from-black to-gray-900">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <h1 className="text-5xl md:text-6xl font-display font-bold">
              <span className="gradient-text">Свяжитесь</span> с нами
            </h1>
            <p className="text-xl text-gray-300">
              Готовы обсудить ваш проект? Мы всегда рады новым задачам и идеям
            </p>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 bg-black">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Contact Info */}
            <div className="lg:col-span-1 space-y-8">
              {/* Contact Cards */}
              <div className="glass rounded-2xl p-6 space-y-6">
                <h2 className="text-2xl font-bold mb-6">Контактная информация</h2>
                
                <div className="space-y-4">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center flex-shrink-0">
                      <Mail className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <div className="font-semibold mb-1">Email</div>
                      <a href="mailto:info@alhimik-studio.ru" className="text-gray-400 hover:text-white transition-colors">
                        info@alhimik-studio.ru
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center flex-shrink-0">
                      <Phone className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <div className="font-semibold mb-1">Телефон</div>
                      <a href="tel:+79999999999" className="text-gray-400 hover:text-white transition-colors">
                        +7 (999) 999-99-99
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <div className="font-semibold mb-1">Адрес</div>
                      <p className="text-gray-400">
                        Россия
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center flex-shrink-0">
                      <Clock className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <div className="font-semibold mb-1">Время работы</div>
                      <p className="text-gray-400">
                        Пн-Пт: 10:00 - 19:00<br />
                        Сб-Вс: По договоренности
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Info */}
              <div className="glass rounded-2xl p-6">
                <h3 className="font-bold mb-4">Быстрый ответ</h3>
                <p className="text-gray-400 text-sm mb-4">
                  Мы отвечаем на все обращения в течение 24 часов. Для срочных вопросов звоните по телефону.
                </p>
                <div className="flex items-center space-x-2 text-primary-400">
                  <MessageSquare className="w-5 h-5" />
                  <span className="text-sm">Среднее время ответа: 2 часа</span>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-2">
              <form onSubmit={handleSubmit} className="glass rounded-2xl p-8 space-y-6">
                <h2 className="text-2xl font-bold mb-6">Отправить заявку</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium mb-2">
                      Имя *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-primary-500 transition-colors"
                      placeholder="Ваше имя"
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-primary-500 transition-colors"
                      placeholder="your@email.com"
                    />
                  </div>

                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium mb-2">
                      Телефон
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-primary-500 transition-colors"
                      placeholder="+7 (999) 999-99-99"
                    />
                  </div>

                  <div>
                    <label htmlFor="company" className="block text-sm font-medium mb-2">
                      Компания
                    </label>
                    <input
                      type="text"
                      id="company"
                      name="company"
                      value={formData.company}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-primary-500 transition-colors"
                      placeholder="Название компании"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="service" className="block text-sm font-medium mb-2">
                    Интересующая услуга
                  </label>
                  <select
                    id="service"
                    name="service"
                    value={formData.service}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-primary-500 transition-colors"
                  >
                    <option value="">Выберите услугу</option>
                    <option value="vr-ar">VR/AR/MR приложения</option>
                    <option value="3d-video">3D Видео и анимация</option>
                    <option value="arch-viz">Архитектурная визуализация</option>
                    <option value="bim">BIM-проектирование</option>
                    <option value="other">Другое</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium mb-2">
                    Сообщение *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    value={formData.message}
                    onChange={handleChange}
                    rows={6}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-primary-500 transition-colors resize-none"
                    placeholder="Расскажите о вашем проекте..."
                  />
                </div>

                <button
                  type="submit"
                  className="w-full md:w-auto px-8 py-4 bg-gradient-to-r from-primary-500 to-accent-500 rounded-full text-white font-medium hover:shadow-lg hover:shadow-primary-500/50 transition-all flex items-center justify-center space-x-2"
                >
                  <span>Отправить</span>
                  <Send className="w-5 h-5" />
                </button>

                <p className="text-sm text-gray-400">
                  * Обязательные поля. Мы не передаем ваши данные третьим лицам.
                </p>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-gradient-to-b from-black to-gray-900">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-display font-bold text-center mb-12">
              Часто задаваемые <span className="gradient-text">вопросы</span>
            </h2>

            <div className="space-y-6">
              {[
                {
                  q: 'Сколько времени занимает разработка проекта?',
                  a: 'Сроки зависят от сложности проекта. Простая визуализация — 1-2 недели, VR-приложение — от 1 месяца, полноценный BIM-проект — от 2 месяцев.',
                },
                {
                  q: 'Какова стоимость ваших услуг?',
                  a: 'Стоимость рассчитывается индивидуально для каждого проекта. Свяжитесь с нами для получения предварительной оценки.',
                },
                {
                  q: 'Работаете ли вы с клиентами из других городов?',
                  a: 'Да, мы работаем с клиентами по всей России и странам СНГ. Все взаимодействие может проходить онлайн.',
                },
                {
                  q: 'Предоставляете ли вы поддержку после завершения проекта?',
                  a: 'Да, мы предоставляем техническую поддержку и консультации после запуска проекта.',
                },
              ].map((faq, index) => (
                <div key={index} className="glass rounded-2xl p-6">
                  <h3 className="text-lg font-bold mb-3">{faq.q}</h3>
                  <p className="text-gray-400">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
