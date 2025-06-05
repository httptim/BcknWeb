// Copyright (c) 2020-2021 Drew Lemmy
// This file is part of KristWeb 2 under AGPL-3.0.
// Full details: https://github.com/tmpim/KristWeb2/blob/master/LICENSE.txt
import { Tag } from "antd";

import { useTranslation } from "react-i18next";

import semverMajor from "semver/functions/major";
import semverMinor from "semver/functions/minor";
import semverPatch from "semver/functions/patch";
import semverPrerelease from "semver/functions/prerelease";

import { ConditionalLink } from "@comp/ConditionalLink";

import { getDevState } from "@utils";

declare const __GIT_VERSION__: string;

const prereleaseTagColours: { [key: string]: string } = {
  "dev": "red",
  "alpha": "orange",
  "beta": "blue",
  "rc": "green"
};

const GIT_RE = /^\d+-g[a-f0-9]{5,32}(?:-dirty)?$/;

export function Brand(): JSX.Element {
  const { t } = useTranslation();

  const gitVersion: string = __GIT_VERSION__;

  // Handle non-semver git versions (like "792c78f-dirty")
  let major = 2, minor = 3, patch = 0;
  let prerelease = null;
  let tag = null;

  try {
    // Try to parse as semver
    major = semverMajor(gitVersion);
    minor = semverMinor(gitVersion);
    patch = semverPatch(gitVersion);
    prerelease = semverPrerelease(gitVersion);

    const isGit = prerelease ? GIT_RE.test(prerelease.join("")) : false;
    const { isDirty, isDev } = getDevState();

    // Convert semver prerelease parts to Bootstrap badge
    const tagContents = isDirty || isDev
      ? ["dev"]
      : (isGit ? null : prerelease);
    
    if (tagContents && tagContents.length) {
      const variant = prereleaseTagColours[tagContents[0]] || undefined;
      tag = <Tag color={variant}>{tagContents.join(".")}</Tag>;
    }
  } catch (e) {
    // If not a valid semver, don't show a tag in production
    // Only show git hash in development
    const isDev = process.env.NODE_ENV === 'development';
    if (isDev && gitVersion && gitVersion !== "2.3.0-static") {
      tag = <Tag color="red">dev-{gitVersion.substring(0, 7)}</Tag>;
    }
  }

  return <div className="site-header-brand">
    <ConditionalLink to="/" matchTo matchExact>
      <img src="/logo.svg" className="logo" />
      {t("app.name")}
      <span className="site-header-brand-version">v{major}.{minor}.{patch}</span>
      {tag}
    </ConditionalLink>
  </div>;
}
