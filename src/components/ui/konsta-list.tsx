import React from 'react';
import { List as KonstaList, ListItem as KonstaListItem } from 'konsta/react';
import { cn } from '@/lib/utils';

interface ListProps {
  className?: string;
  children: React.ReactNode;
}

export function List({ className, children }: ListProps) {
  return (
    <KonstaList className={cn('bg-white rounded-lg', className)}>
      {children}
    </KonstaList>
  );
}

interface ListItemProps {
  className?: string;
  title?: string;
  subtitle?: string;
  text?: string;
  media?: React.ReactNode;
  after?: React.ReactNode;
  link?: boolean;
  onClick?: () => void;
  children?: React.ReactNode;
}

export function ListItem({ 
  className, 
  title, 
  subtitle,
  text, 
  media, 
  after, 
  link,
  onClick,
  children 
}: ListItemProps) {
  return (
    <KonstaListItem
      className={cn(className)}
      title={title}
      subtitle={subtitle}
      text={text}
      media={media}
      after={after}
      link={link}
      onClick={onClick}
    >
      {children}
    </KonstaListItem>
  );
}
