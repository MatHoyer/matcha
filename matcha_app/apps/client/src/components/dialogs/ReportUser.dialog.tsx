import {
  assertDialogData,
  closeGlobalDialog,
  getDataForDialog,
} from '@/hooks/use-dialog';
import { ReportUserForm } from '../forms/ReportUser.form';
import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';

export const ReportUserDialog: React.FC = () => {
  const data = getDataForDialog('report-user');
  if (!assertDialogData('report-user', data)) {
    closeGlobalDialog();
    return null;
  }

  const { userId } = data;

  return (
    <DialogContent className="overflow-auto">
      <DialogHeader>
        <DialogTitle>Report user</DialogTitle>
        <DialogDescription></DialogDescription>
      </DialogHeader>
      <ReportUserForm modal userId={userId} />
    </DialogContent>
  );
};
