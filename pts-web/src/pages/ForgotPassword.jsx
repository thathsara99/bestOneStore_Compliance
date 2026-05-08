// src/pages/ResetPassword.jsx
import React, { useEffect, useState } from 'react';
import {
  Form,
  Input,
  Button,
  Typography,
  message,
  Card,
} from 'antd';
import { MailOutlined, LockOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const { Title, Text } = Typography;

const ResetPasswordPage = () => {
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
      // First, get the reset token
      const tokenResponse = await fetch(`${process.env.REACT_APP_API_BASE}/forgot-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: values.email,
        }),
      });

      const tokenData = await tokenResponse.json();
      console.log('Forgot password response:', tokenData);

      if (!tokenResponse.ok) {
        message.error(tokenData.message || 'Failed to process reset request');
        setLoading(false);
        return;
      }

      // Then immediately reset the password with the token
              const resetResponse = await fetch(`${process.env.REACT_APP_API_BASE}/reset-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: values.email,
          newPassword: values.newPassword,
          confirmPassword: values.confirmPassword,
          resetToken: tokenData.resetToken,
        }),
      });

      const resetData = await resetResponse.json();
      console.log('Reset password response:', resetData);

      if (resetResponse.ok) {
        message.success('Password reset successfully!');
        navigate('/login');
      } else {
        message.error(resetData.message || 'Failed to reset password');
      }
    } catch (error) {
      console.error('Password reset error:', error);
      message.error('Failed to reset password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        @keyframes forgotFadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes forgotBgMove {
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
        .bestone-back-link.ant-btn-link {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 6px 12px;
          height: auto;
          border-radius: 999px;
          background: rgba(13, 107, 55, 0.10);
          color: #0d6b37;
          font-weight: 700;
          transition: all 0.2s ease;
        }
        .bestone-back-link.ant-btn-link:hover,
        .bestone-back-link.ant-btn-link:focus {
          background: rgba(13, 107, 55, 0.18);
          color: #0a542c;
        }
      `}</style>
      <div
        style={{
          position: 'relative',
          height: '100vh',
          width: '100%',
          backgroundImage: `
            radial-gradient(circle at 12% 25%, rgba(255, 209, 102, 0.32), transparent 44%),
            radial-gradient(circle at 86% 78%, rgba(48, 163, 89, 0.25), transparent 48%),
            linear-gradient(120deg, #0a3d22 0%, #0f6f3b 40%, #1f8f4f 100%)
          `,
          backgroundSize: '140% 140%',
          backgroundPosition: '0% 50%',
          backgroundRepeat: 'no-repeat',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '24px',
          boxSizing: 'border-box',
          overflow: 'hidden',
          animation: 'forgotBgMove 16s ease-in-out infinite alternate'
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
      <Card
        style={{
          width: '100%',
          maxWidth: 520,
          borderRadius: 18,
          boxShadow: '0 24px 55px rgba(0, 0, 0, 0.35)',
          border: '1px solid rgba(28, 119, 70, 0.22)',
          background: 'linear-gradient(160deg, rgba(255, 255, 255, 0.97), rgba(245, 255, 249, 0.94))',
          backdropFilter: 'blur(10px)',
          animation: 'forgotFadeIn 0.6s ease-out',
          transition: 'transform 0.25s ease, box-shadow 0.25s ease'
        }}
        bodyStyle={{ padding: '34px 34px 28px' }}
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
              <Text style={{ color: '#2f5f43' }}>
                Reset your account password to continue managing your store.
              </Text>
            </div>

            <Form
              form={form}
              name="resetPassword"
              onFinish={onFinish}
              layout="vertical"
            >
              <Form.Item
                name="email"
                label="Email Address"
                rules={[
                  { required: true, message: 'Please enter your email!' },
                  { type: 'email', message: 'Please enter a valid email!' },
                ]}
              >
                <Input
                  prefix={<MailOutlined />}
                  placeholder="you@example.com"
                  size="large"
                  style={{ borderRadius: 10, backgroundColor: '#ffffff', borderColor: '#9fcfb4' }}
                />
              </Form.Item>

              <Form.Item
                name="newPassword"
                label="New Password"
                rules={[
                  { required: true, message: 'Please enter your new password!' },
                  { min: 6, message: 'Password must be at least 6 characters long!' },
                ]}
              >
                <Input.Password
                  prefix={<LockOutlined />}
                  placeholder="New Password"
                  size="large"
                  style={{ borderRadius: 10, backgroundColor: '#ffffff', borderColor: '#9fcfb4' }}
                />
              </Form.Item>

              <Form.Item
                name="confirmPassword"
                label="Confirm Password"
                dependencies={['newPassword']}
                rules={[
                  { required: true, message: 'Please confirm your password!' },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue('newPassword') === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(new Error('Passwords do not match!'));
                    },
                  }),
                ]}
              >
                <Input.Password
                  prefix={<LockOutlined />}
                  placeholder="Confirm Password"
                  size="large"
                  style={{ borderRadius: 10, backgroundColor: '#ffffff', borderColor: '#9fcfb4' }}
                />
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
                  Reset Password
                </Button>
              </Form.Item>
            </Form>

                        <Button
              type="link"
              className="bestone-back-link"
              icon={<ArrowLeftOutlined />}
              onClick={() => navigate('/login')}
              style={{ padding: '6px 12px' }}
            >
              Back to Login
            </Button>
          </Card>
        </div>
    </>
  );
};

export default ResetPasswordPage;
