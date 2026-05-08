import React, { useState, useEffect } from 'react';
import {
  Layout,
  Typography,
  Row,
  Col,
  Card,
  Button,
  Table,
  Badge,
  Tag,
  Space,
  Divider,
  Spin,
  message
} from 'antd';
import { Pie, Bar } from '@ant-design/plots';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import {
  TeamOutlined,
  ExclamationCircleOutlined,
  FieldTimeOutlined,
  UserOutlined,
  ScheduleOutlined,
  CheckCircleOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import ClockInWrapper from '../components/ClockInWrapper';
import { apiClient } from '../config/api';
import './Home.css';

const { Header, Content } = Layout;
const { Title, Text } = Typography;

const DASHBOARD_COLORS = {
  primary: '#0d6b37',
  success: '#1f8f4f',
  warning: '#f0b100',
  danger: '#e05243',
  info: '#2f86c8',
  accent: '#7a56d6'
};

const App = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [hasLoadedDashboard, setHasLoadedDashboard] = useState(false);
  const [dashboardData, setDashboardData] = useState({
    totalEmployees: 0,
    departmentData: [],
    visaStatus: { expired: 0, expiringSoon: 0, valid: 0, pending: 0 },
    expiryNotifications: [],
    recentEmployees: []
  });

  // Employee Table Data
  const employeeColumns = [
    { 
      title: 'Name', 
      dataIndex: 'name',
      sorter: (a, b) => (a.name || '').localeCompare(b.name || ''),
      defaultSortOrder: 'ascend',
      render: (text) => <Text strong>{text}</Text>
    },
    { 
      title: 'Department', 
      dataIndex: 'department',
      sorter: (a, b) => (a.department || '').localeCompare(b.department || ''),
      render: (text) => <Text type="secondary">{text || 'Unassigned'}</Text>
    },
    {
      title: 'Status',
      dataIndex: 'status',
      render: (status) => {
        const colorMap = {
          Active: 'green',
          Inactive: 'orange',
          Terminated: 'red',
        };
        const iconMap = {
          Active: <CheckCircleOutlined />,
          Inactive: <FieldTimeOutlined />,
          Terminated: <ExclamationCircleOutlined />
        };
        return (
          <Tag 
            color={colorMap[status] || 'default'}
            icon={iconMap[status]}
          >
            {status || 'Active'}
          </Tag>
        );
      },
    },
  ];

  // Notification Table Data
  const notificationColumns = [
    { 
      title: 'Employee', 
      dataIndex: 'employee',
      sorter: (a, b) => (a.employee || '').localeCompare(b.employee || ''),
      defaultSortOrder: 'ascend',
      render: (text) => <Text strong>{text}</Text>
    },
    { 
      title: 'Visa Type', 
      dataIndex: 'visaType',
      sorter: (a, b) => (a.visaType || '').localeCompare(b.visaType || ''),
      render: (text) => <Text type="secondary">{text}</Text>
    },
    { 
      title: 'Expires In', 
      dataIndex: 'expiresIn',
      render: (text) => <Text type="warning">{text}</Text>
    },
    {
      title: 'Expiry Date',
      dataIndex: 'expiryDate',
      render: (text) => <Text>{text || 'N/A'}</Text>
    },
    {
      title: 'Status',
      dataIndex: 'status',
      render: (status) => (
        <Badge 
          status={
            status === 'Expiring Soon'
              ? 'warning'
              : status === 'Pending'
                ? 'processing'
              : status === 'Valid'
                ? 'success'
                : 'error'
          }
          text={status} 
        />
      ),
    },
  ];

  // Fetch dashboard data
  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    if (!hasLoadedDashboard) setLoading(true);
    let lastError = null;

    for (let attempt = 1; attempt <= 2; attempt += 1) {
      try {
        const response = await apiClient.get('/employees/dashboard-stats', { timeout: 30000 });
        if (response?.data?.success) {
          setDashboardData(response.data.data);
          setHasLoadedDashboard(true);
          setLoading(false);
          return;
        }
        lastError = new Error('Invalid dashboard response');
      } catch (error) {
        lastError = error;
      }
    }

    console.error('Error fetching dashboard data:', lastError);
    if (!hasLoadedDashboard) {
      const errorMessage = lastError?.response?.data?.message || 'Failed to load dashboard data';
      message.error(errorMessage);
      setLoading(false);
    }
  };

  // Prepare chart data
  const visaStatusData = [
    { type: 'Pending', value: dashboardData.visaStatus.pending || 0 },
    { type: 'Expired', value: dashboardData.visaStatus.expired },
    { type: 'Expiring Soon', value: dashboardData.visaStatus.expiringSoon },
    { type: 'Valid', value: dashboardData.visaStatus.valid },
  ];

  const departmentData = dashboardData.departmentData || [];

  const barConfig = {
    data: departmentData,
    xField: 'employees',
    yField: 'department',
    seriesField: 'department',
    legend: false,
    color: '#2f8a58',
    height: 210,
    barStyle: {
      radius: [999, 999, 999, 999],
      fillOpacity: 0.88
    },
    label: {
      position: 'right',
      style: {
        fill: '#1f5b39',
        fontWeight: 700
      }
    },
    tooltip: { showMarkers: false },
    meta: {
      employees: {
        alias: 'Employees',
      },
    },
    xAxis: {
      grid: null,
      label: {
        style: {
          fill: '#5b7c68',
          fontWeight: 600
        },
        formatter: (val) => `${val}`,
      },
    },
    yAxis: {
      grid: null,
      label: {
        style: {
          fill: '#2f5f43',
          fontWeight: 600
        }
      }
    },
    animation: false
  };

  const exportExpiryNotificationsPdf = () => {
    const allNotifications = dashboardData.expiryNotifications || [];
    const expiredCount = allNotifications.filter((item) => item.status === 'Expired').length;
    const pendingCount = allNotifications.filter((item) => item.status === 'Pending').length;
    const expiringSoonCount = allNotifications.filter((item) => item.status === 'Expiring Soon').length;
    const validCount = allNotifications.filter((item) => item.status === 'Valid').length;
    const noVisaDataCount = allNotifications.filter((item) => item.status === 'No Visa Data').length;

    if (allNotifications.length === 0) {
      message.info('No visa records available to export');
      return;
    }

    const doc = new jsPDF('p', 'mm', 'a4');
    doc.setFillColor(13, 107, 55);
    doc.rect(0, 0, 210, 22, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(16);
    doc.text('Best One Store', 14, 14);
    doc.setFontSize(10);
    doc.text('Admin Suite', 14, 19);
    doc.setTextColor(32, 74, 52);
    doc.setFontSize(12);
    doc.setFont(undefined, 'bold');
    doc.text('Visa Expiry Notification Report', 14, 33);
    doc.setFontSize(10);
    doc.setFont(undefined, 'normal');
    doc.text(`Generated on: ${new Date().toLocaleString('en-GB')}`, 14, 39);
    doc.text(`Total Records: ${allNotifications.length}`, 150, 39, { align: 'right' });

    doc.setFontSize(10);
    doc.text(`Expired: ${expiredCount}`, 14, 46);
    doc.text(`Pending: ${pendingCount}`, 50, 46);
    doc.text(`Expiring Soon: ${expiringSoonCount}`, 85, 46);
    doc.text(`Valid: ${validCount}`, 132, 46);
    doc.text(`No Visa Data: ${noVisaDataCount}`, 165, 46);

    autoTable(doc, {
      startY: 52,
      head: [['Employee', 'Visa Type', 'Visa Period', 'Expires In', 'Status']],
      body: allNotifications.map((item) => ([
        item.employee || 'N/A',
        item.visaType || 'N/A',
        `${item.visaStartDate || 'N/A'} - ${item.expiryDate || 'N/A'}`,
        item.expiresIn || 'N/A',
        item.status || 'N/A',
      ])),
      styles: {
        fontSize: 9,
        cellPadding: 3,
        textColor: [34, 61, 47]
      },
      headStyles: {
        fillColor: [13, 107, 55],
        textColor: [255, 255, 255]
      },
      alternateRowStyles: { fillColor: [245, 251, 247] }
    });

    doc.save(`visa-expiry-report-${new Date().toISOString().slice(0, 10)}.pdf`);
  };

  if (loading) {
    return (
      <Layout style={{ minHeight: '100vh' }}>
        <Content style={{ margin: '24px', padding: '24px', borderRadius: '8px' }}>
          <div style={{ textAlign: 'center', padding: '50px' }}>
            <Spin size="large" />
          </div>
        </Content>
      </Layout>
    );
  }

  const today = new Date().toLocaleDateString('en-GB', {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });

  return (
    <Layout className="dashboard-layout">
      <Content className="dashboard-content">
        <div className="dashboard-hero">
          <div>
            <Text className="dashboard-hero-label">Operations Overview</Text>
            <Title level={2} className="dashboard-hero-title">Employee Dashboard</Title>
            <Text className="dashboard-hero-subtitle">
              Keep track of workforce status, visa compliance, and daily attendance in one place.
            </Text>
          </div>
          <div className="dashboard-date-pill">{today}</div>
        </div>

        <Row gutter={[24, 24]} style={{ marginBottom: 24 }} className="dashboard-top-row">
          <Col xs={24} sm={12} lg={8} className="dashboard-top-col">
            <Card 
              className="dashboard-card dashboard-card-spotlight"
              title={
                <Space>
                  <TeamOutlined />
                  <span>Employees</span>
                </Space>
              } 
              bordered={false}
              headStyle={{ borderBottom: '1px solid #eef2f7', padding: '0 16px' }}
              bodyStyle={{ padding: '16px' }}
            >
              <Title level={2} className="dashboard-kpi-value">
                {dashboardData.totalEmployees}
              </Title>
              <Text type="secondary" style={{ display: 'block', marginBottom: 16 }}>
                Total employees in the organization
              </Text>
              {departmentData.length > 0 && (
                <div className="dashboard-chart-wrap">
                  <Bar {...barConfig} />
                </div>
              )}
            </Card>
          </Col>

          <Col xs={24} sm={12} lg={8} className="dashboard-top-col">
            <ClockInWrapper />
          </Col>

          <Col xs={24} sm={24} lg={8} className="dashboard-top-col">
            <Card 
              className="dashboard-card dashboard-card-spotlight"
              title={
                <Space>
                  <ExclamationCircleOutlined />
                  <span>Right Work Status</span>
                </Space>
              } 
              bordered={false}
              headStyle={{ borderBottom: '1px solid #eef2f7', padding: '0 16px' }}
              bodyStyle={{ padding: '16px' }}
            >
              <div className="status-summary">
                <div className="status-chip warning">
                  <Text type="secondary">Expiring Soon</Text>
                  <Title level={4} style={{ margin: '4px 0', color: '#faad14' }}>
                    {dashboardData.visaStatus.expiringSoon}
                  </Title>
                </div>
                <div className="status-chip danger">
                  <Text type="secondary">Expired</Text>
                  <Title level={4} style={{ margin: '4px 0', color: '#ff4d4f' }}>
                    {dashboardData.visaStatus.expired}
                  </Title>
                </div>
                <div className="status-chip">
                  <Text type="secondary">Pending</Text>
                  <Title level={4} style={{ margin: '4px 0', color: '#1677ff' }}>
                    {dashboardData.visaStatus.pending || 0}
                  </Title>
                </div>
                <div className="status-chip success">
                  <Text type="secondary">Valid</Text>
                  <Title level={4} style={{ margin: '4px 0', color: '#52c41a' }}>
                    {dashboardData.visaStatus.valid}
                  </Title>
                </div>
              </div>
              {visaStatusData.some(item => item.value > 0) && (
                <div className="dashboard-chart-wrap">
                  <Pie
                    data={visaStatusData}
                    angleField="value"
                    colorField="type"
                    innerRadius={0.74}
                    radius={0.88}
                    label={{
                      formatter: () => '',
                      offset: 0
                    }}
                    legend={{
                      position: "bottom",
                      itemLabel: {
                        style: {
                          fill: '#2f5f43',
                          fontWeight: 600
                        }
                      }
                    }}
                    tooltip={{ showMarkers: true }}
                    interactions={[{ type: "element-highlight" }]}
                    color={['#3f6f56', '#c45849', '#d5a028', '#5ea176']}
                    height={210}
                    pieStyle={{
                      stroke: '#ffffff',
                      lineWidth: 1.5
                    }}
                    statistic={{
                      content: {
                        style: {
                          fontSize: "13px",
                          color: "#4f6f5d",
                          fontWeight: 600
                        },
                        content: `${visaStatusData.reduce((sum, item) => sum + (item.value || 0), 0)} Records`
                      }
                    }}
                    animation={false}
                  />
                </div>
              )}
            </Card>
          </Col>
        </Row>

        <Divider style={{ margin: '8px 0 20px' }} />

        <Row gutter={[24, 24]}>
          <Col xs={24} lg={12}>
            <Card 
              className="dashboard-card dashboard-table-card"
              title={
                <Space>
                  <UserOutlined />
                  <span>Employee List</span>
                </Space>
              } 
              bordered={false}
              headStyle={{ borderBottom: '1px solid #eef2f7' }}
              extra={<Button type="link" onClick={() => navigate('/employee-management')}>View All</Button>}
            >
              <Table 
                dataSource={dashboardData.recentEmployees || []} 
                columns={employeeColumns} 
                pagination={{ pageSize: 5, showSizeChanger: false }} 
                size="middle"
                className="dashboard-table"
                scroll={{ x: 760 }}
              />
            </Card>
          </Col>

          <Col xs={24} lg={12}>
            <Card 
              className="dashboard-card dashboard-table-card"
              title={
                <Space>
                  <ScheduleOutlined />
                  <span>Expiry Notifications</span>
                </Space>
              } 
              bordered={false}
              headStyle={{ borderBottom: '1px solid #eef2f7' }}
              extra={(
                <Space>
                  <Button onClick={exportExpiryNotificationsPdf}>Export PDF</Button>
                  <Button type="link" onClick={() => navigate('/employee-management')}>View All</Button>
                </Space>
              )}
            >
              <Table 
                dataSource={dashboardData.expiryNotifications || []} 
                columns={notificationColumns} 
                pagination={{ pageSize: 5, showSizeChanger: false }} 
                size="middle"
                className="dashboard-table"
                scroll={{ x: 900 }}
              />
            </Card>
          </Col>
        </Row>
      </Content>
    </Layout>
  );
};

export default App;