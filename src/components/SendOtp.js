import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Row, Col, Form, Button, FormGroup } from "react-bootstrap";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import "bootstrap/dist/css/bootstrap.min.css";
import styled from "styled-components";
import route from "../configs/route";
import axiosClient from "../api/axiosClient";

const FormStyled = styled(Form)`
  border: 1px solid var(--primary);
  padding: 20px;
`;

const FormHeaderStyled = styled.h4`
  display: flex;
  justify-content: center;
  text-transform: uppercase;
  margin-bottom: 30px;
`;

const LinkStyled = styled.a`
  margin-left: 10px;
  text-decoration: none;
`;

const SendOtp = () => {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await axiosClient.post(`/users/send-otp`, { email });
    console.log(response);
    alert("Vui lòng kiểm tra mã xác nhận đã gửi qua email của bạn");
    setTimeout(() => {
      navigate(route.register);
    }, 100);
    //success => navigate to /chat

  };

  return (
    <FormStyled onSubmit={handleSubmit}>
      <FormHeaderStyled>vui lòng đăng kí</FormHeaderStyled>
      <FloatingLabel
        controlId="floatingInput"
        label="Nhập Email "
        className="mb-3"
      >
        <Form.Control
          type="email"
          placeholder="name@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </FloatingLabel>
      <Form.Group className="mb-3">
        <Button variant="primary" type="submit">
          Gửi mã xác nhận
        </Button>
      </Form.Group>
    </FormStyled>
  );
};

export default SendOtp;
