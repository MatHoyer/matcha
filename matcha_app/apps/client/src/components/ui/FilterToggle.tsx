import { ChevronUp } from 'lucide-react';
import { motion } from 'motion/react';
import { Button } from './button';
import { Card } from './card';
import { Switch } from './switch';
import { Typography } from './typography';

export const FilterToggle: React.FC<{
  label: string;
  order: 'asc' | 'desc';
  toggleOrder: () => void;
  isActive: boolean;
  toggleActive: () => void;
}> = ({ label, order, toggleOrder, isActive, toggleActive }) => {
  return (
    <Card className="flex items-center gap-2 p-1 h-fit">
      <div className="flex items-center gap-3">
        <Switch checked={isActive} onCheckedChange={toggleActive} />
        <Typography variant="small">{label}</Typography>
      </div>

      <Button variant="ghost" size="icon" onClick={toggleOrder}>
        <motion.div
          animate={{ rotate: order === 'asc' ? 180 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <ChevronUp className="h-4 w-4" />
        </motion.div>
      </Button>
    </Card>
  );
};
