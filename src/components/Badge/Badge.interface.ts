type BadgeStyle = 'neutral' | 'positive' | 'warning' | 'negative';

interface BadgeProps {
  /**
   * Стиль / цветовая тема
   * @default 'neutral'
   */
  colorStyle?: BadgeStyle

  /**
   * Возможность клика по бейджу (с соответствующим поведением)
   * @default false
   */
  clickable?: boolean

  /**
   * Приглушенный цвет
   * @default: false
   */
  dimmed?: boolean

  /**
   * Текст для отображения
   * @default ''
   */
  title: string

  /**
   * Растягивается нв всю ширину родителя
   * @default false
   */
  fullWidth?: boolean
}

export type { BadgeStyle, BadgeProps };
