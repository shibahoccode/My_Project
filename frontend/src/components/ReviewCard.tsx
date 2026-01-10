import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ReviewCardProps {
  name: string;
  avatar: string;
  rating: number;
  review: string;
  source: 'google' | 'facebook';
  date: string;
}

export const ReviewCard = ({ name, avatar, rating, review, source, date }: ReviewCardProps) => {
  return (
    <div className="glass-panel p-5 hover:scale-[1.02] transition-transform duration-300">
      <div className="flex items-start gap-4">
        {/* Avatar */}
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary/30 to-secondary/30 flex items-center justify-center text-lg font-bold text-foreground shrink-0">
          {avatar}
        </div>
        
        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="flex items-center justify-between gap-2 mb-2">
            <div>
              <h4 className="font-semibold text-foreground">{name}</h4>
              <div className="flex items-center gap-2 mt-1">
                {/* Stars */}
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={14}
                      className={cn(
                        i < rating ? 'fill-accent text-accent' : 'fill-muted text-muted'
                      )}
                    />
                  ))}
                </div>
                {/* Source badge */}
                <span className={cn(
                  'text-xs px-2 py-0.5 rounded-full font-medium',
                  source === 'google' 
                    ? 'bg-blue-500/20 text-blue-400' 
                    : 'bg-indigo-500/20 text-indigo-400'
                )}>
                  {source === 'google' ? 'Google' : 'Facebook'}
                </span>
              </div>
            </div>
            <span className="text-xs text-muted-foreground shrink-0">{date}</span>
          </div>
          
          {/* Review text */}
          <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
            {review}
          </p>
        </div>
      </div>
    </div>
  );
};
