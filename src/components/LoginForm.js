import  React, { useContext, useState }  from "react";
import { Container, Row, Col, Form, Button, FormGroup } from 'react-bootstrap';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import 'bootstrap/dist/css/bootstrap.min.css';
import styled from "styled-components";
import route from "../configs/route";
import {AuthToken} from '../authToken/index'
const FormStyled = styled(Form)`
  border: 1px solid var(--primary);
  padding: 20px;
`

const FormHeaderStyled = styled.h4`
  display: flex;
  justify-content: center;
  text-transform: uppercase;
  margin-bottom: 30px;
`

const LinkStyled = styled.a`
  margin-left:10px;
  text-decoration: none;
`


const LoginForm =() => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
   const [showPassword, setShowPassword] = useState(false);
  const { login } = useContext(AuthToken);
  const strongPasswordPattern = new RegExp(
    "^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})"
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      alert("Vui lòng không để trống email hoặc mật khẩu");
      return;
    }
    if (!strongPasswordPattern.test(password)) {
      alert(
        "Mật khẩu phải bao gồm ít nhất 8 ký tự, bao gồm số, ký tự đặc biệt, chữ viết hoa và chữ viết thường"
      );
      return;
    }
    const response = await login({ email, password });

    console.log(response);
  };
  
    return (
      <FormStyled onSubmit={handleSubmit}>
        <FormHeaderStyled>vui lòng đăng nhập</FormHeaderStyled>

        <FloatingLabel
          controlId="floatingInput"
          label="Nhập email của bạn"
          className="mb-3"
        >
          <Form.Control
            type="email"
            placeholder="name@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </FloatingLabel>

        <FloatingLabel
          controlId="floatingPassword"
          label="Mật khẩu"
          className="mb-3"
        >
          <Form.Control
            type={showPassword ? "text" : "password"}
            placeholder="Mật khẩu"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Form.Check
            type="checkbox"
            label="Hiển thị mật khẩu"
            checked={showPassword}
            onChange={(e) => setShowPassword(e.target.checked)}
          />
        </FloatingLabel>

        <Form.Group className="mb-3">
          <Button variant="primary" type="submit">
            Đăng nhập
          </Button>
          <Form.Group className="mt-3">
            Quên mật khẩu?
            <LinkStyled href={route.resetPassword}>Đặt lại</LinkStyled>
          </Form.Group>
        </Form.Group>

        <Form.Group>
          Bạn chưa có tài khoản?
          <LinkStyled href={route.sendOtp}>Đăng ký</LinkStyled>
        </Form.Group>
      </FormStyled>
    );
}

export default LoginForm;
