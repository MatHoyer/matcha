import { CreateTagForm } from '../forms/CreateTag.form';
import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';

export const CreateTagDialog: React.FC = () => {
  return (
    <DialogContent className="overflow-auto">
      <DialogHeader>
        <DialogTitle>Créer un tag</DialogTitle>
        <DialogDescription></DialogDescription>
      </DialogHeader>
      <CreateTagForm modal />
    </DialogContent>
  );
};
