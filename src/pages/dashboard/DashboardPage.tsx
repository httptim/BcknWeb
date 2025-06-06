// Copyright (c) 2020-2021 Drew Lemmy
// This file is part of KristWeb 2 under AGPL-3.0.
// Full details: https://github.com/tmpim/KristWeb2/blob/master/LICENSE.txt
import { Row, Col } from "antd";

import { PageLayout } from "@layout/PageLayout";

import { WalletOverviewCard } from "./WalletOverviewCard";
import { TransactionsCard } from "./TransactionsCard";
import { BlockValueCard } from "./BlockValueCard";
import { BlockDifficultyCard } from "./BlockDifficultyCard";
import { MOTDCard } from "./MOTDCard";
import { TipsCard } from "./TipsCard";

import { useMiningEnabled } from "@api";
import { SyncDetailedWork } from "@global/ws/SyncDetailedWork";

import "./DashboardPage.less";

export function DashboardPage(): JSX.Element {

  const miningEnabled = useMiningEnabled();

  return <PageLayout siteTitleKey="dashboard.siteTitle" className="dashboard-page">
    {/* This was moved away from AppServices to here, as the detailed work
      * data was only used for this page (at least right now). This was, the
      * work will only be fetched when a block is mined while the Dashboard
      * page is actually open and active. */}
    <SyncDetailedWork />

    <Row gutter={16} className="dashboard-main-row">
      <Col span={24} lg={10} xxl={12}><WalletOverviewCard /></Col>
      <Col span={24} lg={14} xxl={12}><TransactionsCard /></Col>
    </Row>

    {/* Only show block value and block difficulty details if the server has
      * mining enabled. */}
    {miningEnabled && <Row gutter={16} className="dashboard-main-row">
      <Col span={24} xl={6}><BlockValueCard /></Col>
      <Col span={24} xl={18}><BlockDifficultyCard /></Col>
    </Row>}

    <Row gutter={16} className="dashboard-main-row">
      <Col span={24} xl={12}><MOTDCard /></Col>
      <Col span={24} xl={12}><TipsCard /></Col>
    </Row>

    {/* TODO: Basic network statistics here */}
  </PageLayout>;
}
