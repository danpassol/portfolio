import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Check, Loader2, Send, Clock } from 'lucide-react';

export default function ContactForm({ lang = 'es' }) {
  const [status, setStatus] = useState('idle'); // idle, submitting, success, error, rate_limit
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({ name: '', surname: '', email: '', message: '' });

  const i18n = {
    es: {
      name: 'Nombre', surname: 'Apellidos', email: 'Email', message: 'Mensaje',
      namePlaceholder: 'Tu nombre', surnamePlaceholder: 'Tus apellidos', emailPlaceholder: 'tu@email.com',
      messagePlaceholder: '¿En qué puedo ayudarte?',
      send: 'Enviar mensaje', sending: 'Enviando...',
      successTitle: '¡Mensaje enviado!',
      successDesc: 'Te responderé lo antes posible.',
      sendAnother: 'Enviar otro mensaje',
      errorMsg: 'Algo ha ido mal. Inténtalo de nuevo.',
      rateLimitTitle: 'Límite alcanzado',
      rateLimitDesc: 'Has superado el número máximo de mensajes permitidos. Puedes volver a intentarlo en 24 horas.',
      required: 'Campo obligatorio',
      invalidEmail: 'Email no válido',
    },
    en: {
      name: 'First name', surname: 'Last name', email: 'Email', message: 'Message',
      namePlaceholder: 'Your first name', surnamePlaceholder: 'Your last name', emailPlaceholder: 'you@email.com',
      messagePlaceholder: 'How can I help you?',
      send: 'Send message', sending: 'Sending...',
      successTitle: 'Message sent!',
      successDesc: "I'll get back to you as soon as possible.",
      sendAnother: 'Send another message',
      errorMsg: 'Something went wrong. Please try again.',
      rateLimitTitle: 'Limit reached',
      rateLimitDesc: 'You have exceeded the maximum number of messages allowed. Please try again in 24 hours.',
      required: 'Required field',
      invalidEmail: 'Invalid email',
    },
  };

  const t = i18n[lang] || i18n.es;

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = t.required;
    if (!formData.surname.trim()) newErrors.surname = t.required;
    if (!formData.email.trim()) {
      newErrors.email = t.required;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = t.invalidEmail;
    }
    if (!formData.message.trim()) newErrors.message = t.required;
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setStatus('submitting');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, lang }),
      });

      if (res.ok) {
        setStatus('success');
        setFormData({ name: '', surname: '', email: '', message: '' });
      } else if (res.status === 429) {
        setStatus('rate_limit');
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
    if (errors[id]) setErrors(prev => ({ ...prev, [id]: undefined }));
    if (status === 'error') setStatus('idle');
  };

  const inputClass = (field) =>
    `w-full px-4 py-3 rounded-xl bg-white dark:bg-white/10 border outline-none transition-all placeholder:text-muted-foreground dark:placeholder:text-white/20 text-foreground dark:text-white ${
      errors[field]
        ? 'border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500'
        : 'border-black/10 dark:border-white/10 focus:border-primary focus:ring-1 focus:ring-primary'
    }`;

  return (
    <div className="w-full max-w-md mx-auto bg-foreground/3 p-8 rounded-3xl border border-foreground/10 backdrop-blur-sm">
      <AnimatePresence mode="wait">

        {status === 'success' ? (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="text-center py-12"
          >
            <div className="w-16 h-16 bg-green-500/20 text-green-400 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-bold mb-2">{t.successTitle}</h3>
            <p className="text-muted-foreground">{t.successDesc}</p>
            <button
              onClick={() => setStatus('idle')}
              className="mt-6 text-sm text-primary hover:underline"
            >
              {t.sendAnother}
            </button>
          </motion.div>

        ) : status === 'rate_limit' ? (
          <motion.div
            key="rate_limit"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="text-center py-12"
          >
            <div className="w-16 h-16 bg-amber-500/20 text-amber-400 rounded-full flex items-center justify-center mx-auto mb-4">
              <Clock className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-bold mb-2">{t.rateLimitTitle}</h3>
            <p className="text-muted-foreground">{t.rateLimitDesc}</p>
          </motion.div>

        ) : (
          <motion.form
            key="form"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onSubmit={handleSubmit}
            className="space-y-4"
            noValidate
          >
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label htmlFor="name" className="block text-sm font-medium mb-2 text-muted-foreground">
                  {t.name} <span className="text-red-500">*</span>
                </label>
                <input
                  type="text" id="name"
                  value={formData.name} onChange={handleChange}
                  className={inputClass('name')}
                  placeholder={t.namePlaceholder}
                />
                {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name}</p>}
              </div>

              <div>
                <label htmlFor="surname" className="block text-sm font-medium mb-2 text-muted-foreground">
                  {t.surname} <span className="text-red-500">*</span>
                </label>
                <input
                  type="text" id="surname"
                  value={formData.surname} onChange={handleChange}
                  className={inputClass('surname')}
                  placeholder={t.surnamePlaceholder}
                />
                {errors.surname && <p className="mt-1 text-xs text-red-500">{errors.surname}</p>}
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-2 text-muted-foreground">
                {t.email} <span className="text-red-500">*</span>
              </label>
              <input
                type="email" id="email"
                value={formData.email} onChange={handleChange}
                className={inputClass('email')}
                placeholder={t.emailPlaceholder}
              />
              {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
            </div>

            <div>
              <label htmlFor="message" className="block text-sm font-medium mb-2 text-muted-foreground">
                {t.message} <span className="text-red-500">*</span>
              </label>
              <textarea
                id="message" rows={4}
                value={formData.message} onChange={handleChange}
                className={`${inputClass('message')} resize-none`}
                placeholder={t.messagePlaceholder}
              />
              {errors.message && <p className="mt-1 text-xs text-red-500">{errors.message}</p>}
            </div>

            {status === 'error' && (
              <p className="text-sm text-red-500 text-center">{t.errorMsg}</p>
            )}

            <button
              type="submit"
              disabled={status === 'submitting'}
              className="w-full py-4 bg-primary text-white font-medium rounded-xl hover:bg-primary/90 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed mt-2"
            >
              {status === 'submitting' ? (
                <><Loader2 className="w-4 h-4 animate-spin" />{t.sending}</>
              ) : (
                <>{t.send}<Send className="w-4 h-4" /></>
              )}
            </button>
          </motion.form>
        )}

      </AnimatePresence>
    </div>
  );
}