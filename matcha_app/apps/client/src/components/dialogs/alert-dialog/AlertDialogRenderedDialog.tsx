import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Input } from '@/components/ui/input';
import { LoadingButton } from '@/components/ui/loaders';
import { Typography } from '@/components/ui/typography';
import { useState } from 'react';

type TDialogBaseProps = {
  loading?: boolean;
};

type TStandardDialogProps = {
  title?: string;
  description?: string;
  confirmText?: string;
  action?:
    | {
        label: string;
        onClick: (
          e: React.MouseEvent<HTMLButtonElement>,
        ) => void | Promise<void>;
      }
    | React.ReactElement;
  cancel?: {
    label: string;
    onClick: (e: React.MouseEvent<HTMLButtonElement>) => void | Promise<void>;
  };
};

type TCustomDialogProps = {
  children?: React.ReactNode;
};

export type TAlertDialogRenderedDialogProps = TDialogBaseProps &
  (TStandardDialogProps | TCustomDialogProps);

export const isStandardDialog = (
  props: TAlertDialogRenderedDialogProps,
): props is TDialogBaseProps & TStandardDialogProps => {
  return !('children' in props);
};

export const AlertDialogRenderedDialog: React.FC<
  TAlertDialogRenderedDialogProps
> = (props) => {
  const [text, setText] = useState('');

  if (!isStandardDialog(props)) {
    return (
      <AlertDialog open>
        <AlertDialogContent>{props.children}</AlertDialogContent>
      </AlertDialog>
    );
  }

  const isConfirmDisabled = props.confirmText
    ? text !== props.confirmText
    : false;

  return (
    <AlertDialog open={true}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{props.title ?? ''}</AlertDialogTitle>
          {typeof props.description === 'string' ? (
            <AlertDialogDescription>{props.description}</AlertDialogDescription>
          ) : (
            props.description
          )}
        </AlertDialogHeader>
        {props.confirmText ? (
          <div>
            <Typography>
              Tapez <Typography variant="code">{props.confirmText}</Typography>{' '}
              pour confirmer.
            </Typography>
            <Input value={text} onChange={(e) => setText(e.target.value)} />
          </div>
        ) : null}
        <AlertDialogFooter>
          <AlertDialogCancel
            disabled={props.loading}
            onClick={props.cancel?.onClick}
          >
            {props.cancel?.label ?? 'Cancel'}
          </AlertDialogCancel>

          {props.action && 'label' in props.action ? (
            <AlertDialogAction asChild>
              <LoadingButton
                loading={props.loading}
                disabled={props.loading || isConfirmDisabled}
                onClick={props.action.onClick}
              >
                {props.action.label}
              </LoadingButton>
            </AlertDialogAction>
          ) : (
            props.action
          )}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
