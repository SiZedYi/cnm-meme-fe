import React, { useState } from "react";
import { Container, Dropdown, Button } from "react-bootstrap"; // Thêm Button từ react-bootstrap
import { ArrowLeft } from "react-bootstrap-icons"; // Import biểu tượng ArrowLeft từ react-bootstrap-icons
import styled from "styled-components";
import SideBar from "../components/chat/SideBar"; // Import SideBar component

const MainContainer = styled.div`
  display: flex;
  height: 100vh; /* Chiều cao là 100% của màn hình */
  width: 200vh;
`;

const ContactListContainer = styled.div`
  flex: 1;
  overflow-y: auto; /* Cho phép cuộn nếu nội dung dài */
`;

const ContactCard = styled.div`
  border: 1px solid #d8d8d8;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const ContactInfo = styled.div`
  flex-grow: 1;
`;

const ContactName = styled.h4`
  font-weight: bold;
  margin-bottom: 5px;
`;

const ContactEmail = styled.p`
  color: #606770;
  margin-bottom: 5px;
`;

const ContactPhone = styled.p`
  color: #606770;
`;

const DropdownButton = styled(Dropdown.Toggle)`
  background-color: #00ae72 !important;
  border-color: #00ae72 !important;
  font-weight: bold;
  &:hover {
    background-color: #008e5e !important;
    border-color: #008e5e !important;
  }
`;

function Contact({ name, email, phone, onAction }) {
  return (
    <ContactCard>
      <ContactInfo>
        <ContactName>{name}</ContactName>
        <ContactEmail>Email: {email}</ContactEmail>
        <ContactPhone>Số điện thoại: {phone}</ContactPhone>
      </ContactInfo>
      <Dropdown>
        <DropdownButton variant="primary" id="dropdown-basic">
          Thao tác
        </DropdownButton>
        <Dropdown.Menu>
          <Dropdown.Item onClick={() => onAction("view")}>Xem</Dropdown.Item>
          <Dropdown.Item onClick={() => onAction("block")}>Chặn</Dropdown.Item>
          <Dropdown.Item onClick={() => onAction("delete")}>Xóa</Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    </ContactCard>
  );
}

function CallList() {
  const [contacts, setContacts] = useState([]);

  // Tạo danh sách liên hệ
  for (let i = 1; i <= 50; i++) {
    contacts.push({
      name: `Người dùng ${i}`,
      email: `user${i}@example.com`,
      phone: `098765432${i}`,
    });
  }

  const handleAction = (action, phone) => {
    if (action === "view") {
      console.log(`Xem thông tin của người dùng có số điện thoại: ${phone}`);
    } else if (action === "block") {
      console.log(`Chặn người dùng có số điện thoại: ${phone}`);
    } else if (action === "delete") {
      console.log(`Xóa người dùng có số điện thoại: ${phone}`);
    }
  };

  return (
    <MainContainer>
      <SideBar /> 
      <ContactListContainer>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Button variant="primary" className="mb-2">
            <ArrowLeft />
          </Button>{" "}
          <h2 style={{ margin: 0, marginLeft: "10px" }}>Danh Bạ Meme</h2>
        </div>
        {contacts.map((contact, index) => (
          <Contact
            key={index}
            name={contact.name}
            email={contact.email}
            phone={contact.phone}
            onAction={(action) => handleAction(action, contact.phone)}
          />
        ))}
      </ContactListContainer>
    </MainContainer>
  );
}

export default CallList;
