import React, { useState } from "react";
import { Container, Row, Col, Form, Button, FormGroup } from "react-bootstrap";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import "bootstrap/dist/css/bootstrap.min.css";
import styled from "styled-components";
import route from "../configs/route";
import axiosClient from "../api/axiosClient";
import { useNavigate } from "react-router-dom";
const FormStyled = styled(Form)`
  border: 1px solid var(--primary);
  padding: 20px;
`;

const LinkStyled = styled.a`
  margin-left: 10px;
  text-decoration: none;
`;

const RegisterForm = () => {
  const navigate = useNavigate();
  const [username, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [gender, setGender] = useState("Nam");
  const [dateOfBirth, setDateOfBirth] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log({
      username,
      password,
      email,
      phoneNumber,
      displayName,
      gender,
      dateOfBirth,
      
    });

    axiosClient.post(`/users/send-otp`, {
      username,
      password,
      email,
      phoneNumber,
      displayName,
      gender,
      dateOfBirth,
      
    })
    .then(response => {
      sessionStorage.setItem("registerData", JSON.stringify(response));
      alert("Vui lòng kiểm tra mã xác nhận đã gửi qua email của bạn");
  
      navigate(route.registerConfirm);
    })
    .catch(err => {
      alert(err.message)
    })
  };
  return (
    <FormStyled onSubmit={handleSubmit}>
      <Form.Group className="mb-3" controlId="registerUsername">
        <Form.Label>Tên tài khoản</Form.Label>
        <Form.Control
          type="text"
          placeholder="Nguyễn Văn A"
          value={username}
          //ràng buộc không được rỗng:
          required
          onChange={(e) => setUserName(e.target.value)}
        />
      </Form.Group>

      <Form.Group className="mb-3" controlId="registerPassword">
        <Form.Label>Mật khẩu</Form.Label>
        <Form.Control
          type="password"
          placeholder="Mật khẩu"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          //ràng buộc mật khẩu mạnh:
          pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"
          required
        />
      </Form.Group>

      <Form.Group className="mb-3" controlId="registerEmailInput">
        <Form.Label>Email</Form.Label>
        <Form.Control
          placeholder="nguyenvana@gmail.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required

        />
      </Form.Group>

      <Form.Group className="mb-3" controlId="registerPhoneNumber">
        <Form.Label>Số điện thoại</Form.Label>
        <Form.Control
          placeholder="0901234567"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          required
          pattern="0[0-9]{9}"

        />
      </Form.Group>

      <Form.Group className="mb-3" as={Col} controlId="registerDisplayName">
        <Form.Label>Tên hiển thị</Form.Label>
        <Form.Control
          placeholder="David Nguyen"
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          required

        />
      </Form.Group>
      <Form.Label className="mb-3">Giới tính</Form.Label>
      <Row className="mb-3">
        <Col md="3">
          <Form.Check
            type="radio"
            label="Nam"
            name="registerRadios"
            id="maleRadio"
            value="Nam"
            checked={gender === "Nam"}
            onChange={() => setGender("Nam")}
          />
        </Col>
        <Col md="2">
          <Form.Check
            type="radio"
            label="Nữ"
            name="registerRadios"
            id="femaleRadio"
            value="Nữ"
            checked={gender === "Nữ"}
            onChange={() => setGender("Nữ")}
          />
        </Col>
      </Row>

      <Form.Group as={Col} controlId="registerDateInput" className="mb-3">
        <Form.Label>Ngày sinh</Form.Label>
        <Form.Control
          type="date"
          value={dateOfBirth}
          onChange={(e) => setDateOfBirth(e.target.value)}
        />
      </Form.Group>
      
      <Button variant="primary" type="submit">
        Đăng ký
      </Button>
      <Form.Group className="mt-3">
        Bạn đã có tài khoản?
        <LinkStyled href={route.home}>Đăng nhập</LinkStyled>
      </Form.Group>
    </FormStyled>
  );
};

export default RegisterForm;
