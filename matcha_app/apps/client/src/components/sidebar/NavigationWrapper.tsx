'use client';
import { PropsWithChildren } from 'react';

import { useSession } from '@/hooks/useSession';
import { getUrl } from '@matcha/common';
import { useNavigate } from 'react-router-dom';
import { Logo } from '../images/Logo';
import { ThemeToggle } from '../theme/ThemeToggle';
import { Separator } from '../ui/separator';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from '../ui/sidebar';

type TSidebarProps = {
  sidebarHeader?: React.ReactNode;
  sidebarContent?: React.ReactNode;
  sidebarFooter?: React.ReactNode;
};

type TMiddleContentProps = {
  topLeftChildren?: React.ReactNode;
  topRightChildren?: React.ReactNode;
};

const SidebarWrapper: React.FC<TSidebarProps & PropsWithChildren> = ({
  sidebarHeader,
  sidebarContent,
  sidebarFooter,
  children,
}) => {
  return (
    <SidebarProvider>
      <div className="flex h-dvh w-full gap-0">
        <Sidebar>
          {sidebarHeader && (
            <SidebarHeader className="h-[65px] border-b">
              {sidebarHeader}
            </SidebarHeader>
          )}
          {sidebarContent && <SidebarContent>{sidebarContent}</SidebarContent>}
          <Separator />
          {sidebarFooter && (
            <SidebarFooter>
              <SidebarMenu>
                <SidebarMenuItem>{sidebarFooter}</SidebarMenuItem>
              </SidebarMenu>
            </SidebarFooter>
          )}
        </Sidebar>
        <div className="flex-1">{children}</div>
      </div>
    </SidebarProvider>
  );
};

const MiddleContent: React.FC<
  TMiddleContentProps & { isSidebar?: boolean } & PropsWithChildren
> = ({ topLeftChildren, topRightChildren, isSidebar, children }) => {
  const session = useSession();
  const navigate = useNavigate();

  return (
    <div className="flex flex-col">
      <header className="flex h-[65px] items-center gap-4 border-b bg-sidebar px-4">
        {isSidebar && <SidebarTrigger />}
        {session.user === null && (
          <Logo size="sm" onClick={() => navigate(getUrl('client-home'))} />
        )}
        <div className="w-full flex-1">{topLeftChildren}</div>
        <div className="flex items-center gap-2">
          {topRightChildren}
          <ThemeToggle />
        </div>
      </header>
      <main className="relative m-0 h-[calc(100dvh-65px)] overflow-auto p-0">
        {children}
      </main>
    </div>
  );
};

export const NavigationWrapper: React.FC<
  TSidebarProps & TMiddleContentProps & PropsWithChildren
> = ({
  sidebarHeader,
  sidebarContent,
  sidebarFooter,
  topLeftChildren,
  topRightChildren,
  children,
}) => {
  return sidebarHeader || sidebarContent || sidebarFooter ? (
    <SidebarWrapper
      sidebarHeader={sidebarHeader}
      sidebarContent={sidebarContent}
      sidebarFooter={sidebarFooter}
    >
      <MiddleContent
        topLeftChildren={topLeftChildren}
        topRightChildren={topRightChildren}
        isSidebar
      >
        {children}
      </MiddleContent>
    </SidebarWrapper>
  ) : (
    <MiddleContent
      topLeftChildren={topLeftChildren}
      topRightChildren={topRightChildren}
    >
      {children}
    </MiddleContent>
  );
};
