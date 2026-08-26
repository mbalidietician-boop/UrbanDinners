'use client';

import { motion } from 'framer-motion';
import {
  Bell,
  Snowflake,
  ShoppingCart,
  ChefHat,
  Package,
  Clock,
  Info,
} from 'lucide-react';

import { cn } from '@/lib/utils';
import { useAppStore } from '@/store/useAppStore';
import { Card, CardContent } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

// ─── Reminder Types Config ───────────────────────────────────────────────────

const REMINDER_TYPES = [
  {
    key: 'defrostEnabled' as const,
    icon: Snowflake,
    title: 'Defrost Reminders',
    description:
      'Get reminded to take meat out of the freezer the night before cooking.',
    emoji: '\u2744\uFE0F',
  },
  {
    key: 'groceryEnabled' as const,
    icon: ShoppingCart,
    title: 'Grocery Shopping',
    description:
      'Weekly reminder to do your grocery shopping for the week ahead.',
    emoji: '\uD83D\uDED2',
  },
  {
    key: 'mealPrepEnabled' as const,
    icon: ChefHat,
    title: 'Meal Prep Alerts',
    description:
      'Reminders for Sunday meal prep sessions to get ahead for the week.',
    emoji: '\uD83D\uDC68\u200D\uD83C\uDF73',
  },
  {
    key: 'leftoverEnabled' as const,
    icon: Package,
    title: 'Leftover Reminders',
    description:
      "Don't forget about leftovers in the fridge — reduce food waste!",
    emoji: '\uD83D\uDCE6',
  },
];

// ─── Animation ───────────────────────────────────────────────────────────────

const cardVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.4, ease: 'easeOut' },
  }),
};

// ─── Component ───────────────────────────────────────────────────────────────

export default function RemindersSection() {
  const { reminderSettings, setReminderSettings } = useAppStore();

  return (
    <section id="reminders" className="py-12 sm:py-16">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        {/* ── Header ────────────────────────────────────────────────────── */}
        <div className="mb-8 sm:mb-10">
          <div className="flex items-center gap-2.5 mb-1.5">
            <Bell className="size-5 text-primary" />
            <h2 className="font-display text-2xl font-bold tracking-tight sm:text-3xl">
              Smart Reminders
            </h2>
          </div>
          <p className="text-sm text-muted-foreground sm:text-base">
            Never forget to defrost, prep, or shop again
          </p>
        </div>

        {/* ── Example Reminder Card ─────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8 rounded-xl bg-warm p-5 sm:p-6"
        >
          <div className="flex items-start gap-4">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/10">
              <Bell className="size-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-sm text-warm-foreground">
                Dinner Reminder
              </h3>
              <p className="mt-1 text-sm text-warm-foreground/90 leading-relaxed">
                Your chicken curry is planned for tomorrow. Please take chicken
                out of the freezer tonight.
              </p>
              <p className="mt-2 text-xs text-warm-foreground/60">
                Sent today at {reminderSettings.reminderTime || '17:00'}
              </p>
            </div>
          </div>
        </motion.div>

        {/* ── Reminder Toggles Grid ─────────────────────────────────────── */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {REMINDER_TYPES.map((reminder, index) => {
            const Icon = reminder.icon;
            const isEnabled = reminderSettings[reminder.key];

            return (
              <motion.div
                key={reminder.key}
                custom={index}
                variants={cardVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
              >
                <Card
                  className={cn(
                    'shadow-none transition-colors duration-200',
                    isEnabled && 'border-primary/30 bg-primary/[0.02]',
                  )}
                >
                  <CardContent className="flex items-start gap-4 p-4 sm:p-5">
                    <div
                      className={cn(
                        'flex size-10 shrink-0 items-center justify-center rounded-lg transition-colors',
                        isEnabled
                          ? 'bg-primary/10 text-primary'
                          : 'bg-muted text-muted-foreground',
                      )}
                    >
                      <Icon className="size-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <Label
                          htmlFor={reminder.key}
                          className="font-medium text-sm cursor-pointer"
                        >
                          {reminder.title}
                        </Label>
                        <Switch
                          id={reminder.key}
                          checked={isEnabled}
                          onCheckedChange={(checked) =>
                            setReminderSettings({ [reminder.key]: !!checked })
                          }
                        />
                      </div>
                      <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
                        {reminder.description}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* ── Reminder Time ─────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="mt-4"
        >
          <Card className="shadow-none">
            <CardContent className="flex items-center gap-4 p-4 sm:p-5">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-muted">
                <Clock className="size-5 text-muted-foreground" />
              </div>
              <div className="flex flex-1 items-center justify-between gap-4">
                <div>
                  <Label htmlFor="reminder-time" className="font-medium text-sm">
                    Default reminder time
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    When should we send you reminders?
                  </p>
                </div>
                <Select
                  value={reminderSettings.reminderTime}
                  onValueChange={(value) =>
                    setReminderSettings({ reminderTime: value })
                  }
                >
                  <SelectTrigger className="w-[120px]" id="reminder-time">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="16:00">16:00</SelectItem>
                    <SelectItem value="17:00">17:00</SelectItem>
                    <SelectItem value="18:00">18:00</SelectItem>
                    <SelectItem value="19:00">19:00</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* ── How It Works ──────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="mt-6"
        >
          <div className="rounded-lg bg-muted/50 p-4 sm:p-5">
            <div className="flex items-start gap-3">
              <Info className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
              <div>
                <h3 className="text-sm font-semibold text-foreground">
                  How Reminders Work
                </h3>
                <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
                  In the full premium version of What&apos;s For Dinner?,
                  reminders will be sent directly to your phone based on your
                  meal plan and preferences. The settings above show what
                  will be available. Defrost reminders look ahead at
                  tomorrow&apos;s meals and alert you the night before.
                  Grocery reminders arrive on your preferred shopping day.
                  Leftover reminders help you use up food before it expires,
                  saving you money and reducing waste.
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}