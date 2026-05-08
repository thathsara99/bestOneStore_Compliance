import React, { useEffect, useState } from 'react';
import {
  Form,
  Input,
  Button,
  Typography,
  Checkbox,
  Layout,
  Row,
  Col,
  message,
  Card,
} from 'antd';
import {
  UserOutlined,
  LockOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { setAuthToken } from '../utils/auth';

const { Title, Text, Link } = Typography;

const LoginPage = ({ onLoginSuccess }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const previousBodyOverflow = document.body.style.overflow;
    const previousHtmlOverflow = document.documentElement.style.overflow;
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = previousBodyOverflow;
      document.documentElement.style.overflow = previousHtmlOverflow;
    };
  }, []);

  const onFinish = async (values) => {
  setLoading(true);

  try {
    const response = await fetch(`${process.env.REACT_APP_API_BASE}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: values.username,
        password: values.password,
      }),
    });

    const data = await response.json();

    if (response.ok) {
      // Save token & expiry time using utility function
      setAuthToken(data.token);

      message.success('Login successful!');
      if (onLoginSuccess) onLoginSuccess();
      navigate('/home');
    } else {
      message.error(data.message || 'Invalid username or password!');
    }
  } catch (error) {
    message.error('Login failed. Please try again.');
  } finally {
    setLoading(false);
  }
};

  return (
    <>
      <style>{`
        @keyframes loginFadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes loginBgMove {
          from { background-position: 0% 50%; }
          to { background-position: 100% 50%; }
        }
        @keyframes glowPulse {
          0% { transform: scale(1); opacity: 0.55; }
          50% { transform: scale(1.08); opacity: 0.75; }
          100% { transform: scale(1); opacity: 0.55; }
        }
        @keyframes patternDrift {
          from { transform: translateX(0) translateY(0); }
          to { transform: translateX(-24px) translateY(16px); }
        }
        .bestone-auth-link.ant-typography {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 6px 10px;
          border-radius: 999px;
          background: rgba(13, 107, 55, 0.10);
          color: #0d6b37;
          font-weight: 700;
          transition: all 0.2s ease;
        }
        .bestone-auth-link.ant-typography:hover {
          background: rgba(13, 107, 55, 0.18);
          color: #0a542c;
        }
      `}</style>
      <Layout
        style={{
          height: '100vh',
          backgroundImage: `
            radial-gradient(circle at 12% 25%, rgba(255, 209, 102, 0.32), transparent 44%),
            radial-gradient(circle at 86% 78%, rgba(48, 163, 89, 0.25), transparent 48%),
            linear-gradient(120deg, #0a3d22 0%, #0f6f3b 40%, #1f8f4f 100%)
          `,
          backgroundSize: '140% 140%',
          backgroundPosition: '0% 50%',
          backgroundRepeat: 'no-repeat',
          animation: 'loginBgMove 16s ease-in-out infinite alternate',
          overflow: 'hidden',
          padding: '24px',
          boxSizing: 'border-box'
        }}
      >
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: 'repeating-linear-gradient(120deg, rgba(255,255,255,0.06) 0px, rgba(255,255,255,0.06) 2px, transparent 2px, transparent 24px)',
          maskImage: 'linear-gradient(to bottom, rgba(0,0,0,0.25), rgba(0,0,0,0.05) 55%, rgba(0,0,0,0.2))',
          animation: 'patternDrift 18s linear infinite alternate',
          pointerEvents: 'none'
        }}
      />
      <div
        style={{
          position: 'absolute',
          top: '-120px',
          left: '-160px',
          width: '52%',
          height: '150%',
          transform: 'rotate(-22deg)',
          background: 'linear-gradient(180deg, rgba(255,255,255,0.11), rgba(255,255,255,0.02))',
          border: '1px solid rgba(255,255,255,0.15)',
          borderRadius: 40,
          pointerEvents: 'none'
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: '-180px',
          right: '-170px',
          width: '46%',
          height: '130%',
          transform: 'rotate(-24deg)',
          background: 'linear-gradient(180deg, rgba(255,255,255,0.10), rgba(255,255,255,0.02))',
          border: '1px solid rgba(255,255,255,0.14)',
          borderRadius: 40,
          pointerEvents: 'none'
        }}
      />
      <div
        style={{
          position: 'absolute',
          top: '-120px',
          right: '-90px',
          width: 360,
          height: 360,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255, 209, 102, 0.75), rgba(255, 209, 102, 0))',
          filter: 'blur(4px)',
          animation: 'glowPulse 8s ease-in-out infinite',
          pointerEvents: 'none'
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: '-150px',
          left: '-120px',
          width: 420,
          height: 420,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(98, 195, 127, 0.62), rgba(98, 195, 127, 0))',
          filter: 'blur(6px)',
          animation: 'glowPulse 10s ease-in-out infinite',
          pointerEvents: 'none'
        }}
      />
      <Row
        style={{ height: '100%', width: '100%', margin: 0 }}
        justify="center"
        align="middle"
      >
        <Col
          xs={24}
          sm={24}
          md={20}
          lg={14}
          xl={11}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 0
          }}
        >
          <Card
            style={{
              width: '100%',
              maxWidth: '520px',
              minHeight: 'auto',
              margin: 0,
              animation: 'loginFadeIn 0.6s ease-out',
              transition: 'transform 0.25s ease, box-shadow 0.25s ease',
              background: 'linear-gradient(160deg, rgba(255, 255, 255, 0.97), rgba(245, 255, 249, 0.94))',
              border: '1px solid rgba(28, 119, 70, 0.22)',
              boxShadow: '0 24px 55px rgba(0, 0, 0, 0.35)',
              backdropFilter: 'blur(10px)',
              borderRadius: 18
            }}
            bodyStyle={{ transition: 'transform 0.25s ease', padding: '34px 34px 28px' }}
            hoverable
          >
            <div style={{ textAlign: 'center', marginBottom: 24 }}>
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: 12,
                  padding: '8px 16px',
                  borderRadius: 999,
                  background: 'linear-gradient(90deg, #f6b40e 0%, #f6cd4f 100%)',
                  color: '#084b28',
                  fontWeight: 700,
                  letterSpacing: 0.3
                }}
              >
                BEST ONE STORE
              </div>
              <Title level={3} style={{ marginBottom: 8, color: '#0d6b37' }}>Best One Store</Title>
              <Text style={{ color: '#2f5f43' }}>Sign in to manage your convenience store operations.</Text>
            </div>
            <Form
              form={form}
              name="login"
              initialValues={{ remember: true }}
              onFinish={onFinish}
              layout="vertical"
            >
              <Form.Item
                name="username"
                label="Username or Email"
                rules={[{ required: true, message: 'Please input your username or email!' }]}
              >
                <Input
                  prefix={<UserOutlined />}
                  placeholder="Enter your username or email"
                  size="large"
                  style={{ borderRadius: 10, backgroundColor: '#ffffff', borderColor: '#9fcfb4' }}
                />
              </Form.Item>
              <Form.Item
                name="password"
                label="Password"
                rules={[{ required: true, message: 'Please input your password!' }]}
              >
                <Input.Password
                  prefix={<LockOutlined />}
                  placeholder="Enter your password"
                  size="large"
                  style={{ borderRadius: 10, backgroundColor: '#ffffff', borderColor: '#9fcfb4' }}
                />
              </Form.Item>
              <Form.Item>
                <Row justify="space-between" align="middle">
                  <Col>
                    <Form.Item name="remember" valuePropName="checked" noStyle>
                      <Checkbox>Remember me</Checkbox>
                    </Form.Item>
                  </Col>
                  <Col>
                    <Link className="bestone-auth-link" onClick={() => navigate('/forgot-password')} style={{ cursor: 'pointer' }}>
                      Forgot password?
                    </Link>
                  </Col>
                </Row>
              </Form.Item>
              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  block
                  size="large"
                  loading={loading}
                  style={{
                    borderRadius: 10,
                    border: 'none',
                    height: 44,
                    background: 'linear-gradient(90deg, #0d6b37 0%, #19914f 100%)',
                    boxShadow: '0 10px 22px rgba(13, 107, 55, 0.35)',
                    fontWeight: 600
                  }}
                >
                  Log in
                </Button>
              </Form.Item>
            </Form>
          </Card>
        </Col>
      </Row>
      </Layout>
    </>
  );
};

export default LoginPage;
