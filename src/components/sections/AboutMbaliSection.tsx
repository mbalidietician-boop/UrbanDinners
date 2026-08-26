'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { Heart, Award, BookOpen, Users, GraduationCap, Star, Instagram, Facebook } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const credentials = [
  {
    icon: GraduationCap,
    title: 'Registered Dietitian',
    description: 'Qualified and registered with the Health Professions Council of South Africa (HPCSA)',
  },
  {
    icon: Heart,
    title: 'Passionate About Families',
    description: 'Dedicated to making healthy eating practical and achievable for South African households',
  },
  {
    icon: BookOpen,
    title: 'Evidence-Based Nutrition',
    description: 'Every recommendation is grounded in scientific research and clinical practice',
  },
  {
    icon: Users,
    title: 'Community-Focused',
    description: 'Understands the realities of South African kitchens: budget, time, and family preferences',
  },
];

const testimonials = [
  {
    text: "Mbali's meal plans have completely changed how I feed my family. I used to stand in front of the fridge every evening not knowing what to cook. Now I just check the plan and get started. My kids actually look forward to dinner now.",
    name: "Thandi M.",
    role: "Mom of 3, Johannesburg"
  },
  {
    text: "Finally a dietitian who gets it. We eat pap and samp in this house, not quinoa and kale. Mbali never once told me to stop eating the foods my family loves. She just showed me how to make them work better for us.",
    name: "Nomsa K.",
    role: "Mom of 2, Durban"
  },
  {
    text: "The grocery lists have saved me so much time and money. I used to buy random things at the shop and throw away so much food at the end of the week. Now I buy exactly what I need and nothing goes to waste.",
    name: "Lerato P.",
    role: "Working mom, Cape Town"
  },
];

const cardVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.4, ease: 'easeOut' },
  }),
};

export default function AboutMbaliSection() {
  return (
    <section id="about" className="py-12 sm:py-16">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        {/* Header */}
        <div className="mb-10 text-center sm:mb-12">
          <Badge variant="secondary" className="mb-3 gap-1">
            <Star className="size-3" />
            Meet Your Dietitian
          </Badge>
          <h2 className="font-display text-2xl font-bold tracking-tight sm:text-3xl md:text-4xl">
            About Mbali Mapholi
          </h2>
          <p className="mt-2 text-sm text-muted-foreground sm:text-base max-w-lg mx-auto">
            Registered Dietitian on a mission to make healthy family meals simple, affordable, and delicious for South African households.
          </p>
        </div>

        {/* Profile Card */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-10"
        >
          <Card className="shadow-none overflow-hidden">
            <CardContent className="p-0">
              <div className="flex flex-col md:flex-row">
                {/* Profile Photo */}
                <div className="flex items-center justify-center bg-primary/5 p-8 sm:p-12 md:w-1/3">
                  <div className="flex flex-col items-center gap-3">
                    <div className="relative size-28 sm:size-32 overflow-hidden rounded-full ring-4 ring-primary/20">
                      <Image
                        src="/images/mbali.webp"
                        alt="Mbali Mapholi, Registered Dietitian"
                        fill
                        className="object-cover"
                        priority
                      />
                    </div>
                    <div className="text-center">
                      <h3 className="font-display font-bold text-lg text-foreground">
                        Mbali Mapholi
                      </h3>
                      <p className="text-sm text-primary font-medium">
                        Registered Dietitian (RD)
                      </p>
                      {/* Social Links */}
                      <div className="flex items-center justify-center gap-3 mt-2">
                        <a
                          href="https://www.instagram.com/urbandietitian/?hl=en"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-muted-foreground hover:text-pink-500 transition-colors"
                          aria-label="Follow Mbali on Instagram"
                        >
                          <Instagram className="size-4" />
                        </a>
                        <a
                          href="https://www.facebook.com/urbandietitian/"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-muted-foreground hover:text-blue-600 transition-colors"
                          aria-label="Follow Mbali on Facebook"
                        >
                          <Facebook className="size-4" />
                        </a>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bio */}
                <div className="p-6 sm:p-8 md:w-2/3">
                  <div className="space-y-4 text-sm text-foreground/90 leading-relaxed">
                    <p>
                      Mbali Mapholi is a Registered Dietitian with a deep passion for helping South African families eat better without the stress, without the guilt, and without breaking the bank. With years of clinical and community nutrition experience, Mbali understands the unique challenges that busy women and mothers face every day when it comes to feeding their families.
                    </p>
                    <p>
                      Having grown up in a South African household herself, Mbali knows that nutrition advice must be realistic. She believes that healthy eating should celebrate our traditional foods like amadumbe, uphuthu, pap, samp, beans, chakalaka, and all the dishes that bring South African families together around the table. Her approach is never about restriction or complicated recipes. It is about making smarter choices with the foods you already know and love. Less about what not to eat and more about what people can eat more of for good health.
                    </p>
                    <p>
                      &ldquo;What&rsquo;s For Dinner?&rdquo; was born from the question she hears most every night from her younger son: &ldquo;Mommy, what&rsquo;s for dinner?&rdquo; a question that always makes her panic and feel pressured to have a solution immediately. This platform is Mbali&rsquo;s answer: a practical tool that does the thinking for you, so you can focus on what matters most: enjoying meals with your family.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Credentials Grid */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 mb-10">
          {credentials.map((cred, index) => {
            const Icon = cred.icon;
            return (
              <motion.div
                key={cred.title}
                custom={index}
                variants={cardVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
              >
                <Card className="shadow-none h-full">
                  <CardContent className="flex items-start gap-4 p-4 sm:p-5">
                    <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <Icon className="size-5" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm">{cred.title}</h4>
                      <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
                        {cred.description}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* Mbali's Philosophy */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="mb-10 rounded-xl bg-warm p-6 sm:p-8"
        >
          <div className="flex items-start gap-4">
            <Heart className="mt-0.5 size-5 shrink-0 text-primary" />
            <div>
              <h3 className="font-display font-bold text-base text-warm-foreground mb-2">
                Mbali&rsquo;s Philosophy
              </h3>
              <ul className="space-y-2 text-sm text-warm-foreground/90">
                <li className="flex items-start gap-2">
                  <Award className="mt-0.5 size-4 shrink-0 text-primary" />
                  <span>Healthy eating should be practical, not punishing. South African foods are nutritious when prepared well.</span>
                </li>
                <li className="flex items-start gap-2">
                  <Award className="mt-0.5 size-4 shrink-0 text-primary" />
                  <span>Every family deserves a warm, nourishing dinner regardless of budget or time constraints.</span>
                </li>
                <li className="flex items-start gap-2">
                  <Award className="mt-0.5 size-4 shrink-0 text-primary" />
                  <span>Meal planning should reduce stress, not add to it. That is why this platform does the thinking for you.</span>
                </li>
                <li className="flex items-start gap-2">
                  <Award className="mt-0.5 size-4 shrink-0 text-primary" />
                  <span>Children learn eating habits for life. Let us make those habits ones they will be proud of.</span>
                </li>
              </ul>
            </div>
          </div>
        </motion.div>

        {/* Testimonials */}
        <div>
          <h3 className="font-display text-lg font-bold text-center mb-6">
            What Families Say
          </h3>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {testimonials.map((t, i) => (
              <motion.div
                key={t.name}
                custom={i}
                variants={cardVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
              >
                <Card className="shadow-none h-full">
                  <CardContent className="p-4 sm:p-5">
                    <p className="text-sm text-foreground/90 italic leading-relaxed mb-3">
                      &ldquo;{t.text}&rdquo;
                    </p>
                    <div>
                      <p className="text-sm font-semibold">{t.name}</p>
                      <p className="text-xs text-muted-foreground">{t.role}</p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}