// Copyright (c) 2020-2021 Drew Lemmy
// This file is part of KristWeb 2 under AGPL-3.0.
// Full details: https://github.com/tmpim/KristWeb2/blob/master/LICENSE.txt
import { Trans } from "react-i18next";

import { useHostInfo } from "@utils";

declare const __GIT_VERSION__: string;
declare const __PKGBUILD__: string;

export function SidebarFooter(): JSX.Element {
  const host = useHostInfo();

  // Replaced by webpack DefinePlugin and git-revision-webpack-plugin
  const gitVersion: string = __GIT_VERSION__;
  const pkgbuild = __PKGBUILD__;

  return (
    <div className="site-sidebar-footer">
      { host &&
        <div><Trans t={t} i18nKey="sidebar.hostedBy">
          Hosted by <a href={host.host.url} target="_blank" rel="noopener noreferrer">{{ host: host.host.name }}</a>
        </Trans></div>
      }

      {/* Git describe version */}
      <div className="site-sidebar-footer-version">
        {gitVersion}-{pkgbuild}
      </div>
    </div>
  );
}
