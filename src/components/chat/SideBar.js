import  React, { useState, useEffect, useContext, useRef }  from "react";
import { Image, Container, Row, Col, Card, Form  } from 'react-bootstrap';
import { ChatDotsFill, PersonVcard, PersonPlusFill } from 'react-bootstrap-icons';
import 'bootstrap/dist/css/bootstrap.min.css';
import styled from "styled-components";
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
// import { icons } from "../../assets";
import axiosClient from '../../api/axiosClient';
import {AuthToken} from '../../authToken/index'
import route from '../../configs/route'
import { useNavigate } from 'react-router-dom';
import { Link } from "react-router-dom";
import axios from 'axios';
import Cookies from 'js-cookie';

const SideBarStyled = styled.div`
    height: 100vh;
    background-color: var(--primary);
`

const ItemSidebarStyled = styled.div`
    height: calc(100%/9);
    display:flex;
    align-items:center;
    justify-content:center;
`

const ImageSidebarStyled = styled(Image)`
    width: 50px;
    height: 50px;
`
const SideBar = () => {
    // console.log(123);
    const fileInputRef = useRef();
    const [avatar, setAvatar] = useState(''); // Add this line
    const [show, setShow] = useState(false);
    const [userInfo, setUserInfo] = useState({});
    const [userInfoUpdate, setUserInfoUpdate] = useState({});
    const [isEditing, setIsEditing] = useState(false);
    const [file, setFile] = useState(null);
    const { logout } = useContext(AuthToken);
     const navigate = useNavigate();
    const handleClose = () => {setShow(false); setIsEditing(false)};
    const handleShow =  () => {
        setShow(true)}
    ;
    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                const res = await axiosClient.get("/profile");
                console.log(res.data);
                setUserInfo(res.data.data);
                setUserInfoUpdate(res.data.data);
            } catch (error) {
                console.log(error);
            }
        };
        fetchUserInfo()
    },[]);
    const handleUpdateClick = async () => {
      setIsEditing(true);
    };
    const handleCancleClick = () => {
      setIsEditing(false);
      setAvatar('');
      setFile(null);
      setUserInfoUpdate(userInfo);
    };
    const handleChange = (e) => {
      const { name, value } = e.target;
      let updatedValue = value;
    
      if (name === 'dob') {
        updatedValue = value.split("-").reverse().join("-");
      }
    
      setUserInfoUpdate(prevState => ({
        ...prevState,
        [name]: updatedValue
      }));
    };
    
    const handleImageChange = (event) => {
      if (event.target.files && event.target.files[0]) {
        setFile(event.target.files[0]);
      const file = event.target.files[0];
      const reader = new FileReader();
      const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg'];
      if (allowedTypes.includes(file.type)) {
        reader.onload = (e) => {
        setAvatar(e.target.result);
        };

        reader.readAsDataURL(file);
        setIsEditing(true);
      } else {
        alert('Only PNG, JPEG, and JPG images are allowed.');
      }
      }
    };
    
    const handleDoneClick = async () => {
      if(!file && userInfoUpdate.name === userInfo.name && userInfoUpdate.phone === userInfo.phone && userInfoUpdate.dob === userInfo.dob) {
        alert('Nothing to update');
        setIsEditing(false);
        setAvatar('');
        setFile(null);
        setUserInfoUpdate(userInfo);
        return;
      }
      if(avatar) {
        const formData = new FormData();
        formData.append('avatar', file);
        try {
          console.log(process.env.REACT_APP_API_URL + '/api' + '/profile/avatar');
          const response = await axios.post(process.env.REACT_APP_API_URL + '/api' + '/profile/avatar', formData,{
            headers: {
              'Content-Type': 'multipart/form-data',
              'Authorization':  Cookies.get('authToken'),
            },
          })
          if (response.status === 200) {
            alert('Image uploaded successfully');
            console.log('Image uploaded successfully');
            console.log("Updated UserInfo:", userInfo);
            setIsEditing(false);
            setFile(null);
          }else {
            console.log('Failed to upload image');
            setIsEditing(false);
            setAvatar('');
            setFile(null);
            setUserInfoUpdate(userInfo);
          }
        } catch (error) {
          console.log('Error uploading image:', error);
          setIsEditing(false);
          setAvatar('');
          setFile(null);
          setUserInfoUpdate(userInfo);
        }
      }
      if(userInfoUpdate.name !== userInfo.name || userInfoUpdate.phone !== userInfo.phone || userInfoUpdate.dob !== userInfo.dob) {
        console.log('Updating profile: ', userInfoUpdate);
        const response = await axiosClient.post('/profile', userInfoUpdate);
        
        if (response.status === 200) {
          alert('Profile updated successfully');
          console.log("Updated UserInfo:", userInfo);
          setIsEditing(false);
          setFile(null);
          const res = await axiosClient.get("/profile");
          console.log(res.data);
          setUserInfo(res.data.data);
          setUserInfoUpdate(res.data.data);
        }else {
          console.log('Failed to update profile');
          setIsEditing(false);
          setAvatar('');
          setFile(null);
          setUserInfoUpdate(userInfo);
        }
      } 
    }
    
    const handleLogoutClick = () => {
      const confirm = window.confirm("Are you sure you want to logout?");
      if (confirm) {
        logout();
		    navigate(route.home);
      }
    }
    const triggerFileSelectPopup = () => fileInputRef.current.click();
    
        return (
        <><SideBarStyled>
            <ItemSidebarStyled style={{ cursor: "pointer" }} onClick={handleShow}>
                <ImageSidebarStyled
                    src={userInfo.avatar ? userInfo.avatar : "https://i.imgur.com/rsJjBcH.png"}
                    roundedCircle />
            </ItemSidebarStyled>

            <ItemSidebarStyled>
                <Link to={route.chat}>
                  <ChatDotsFill size={35} color="white" />
                </Link>
              </ItemSidebarStyled>

              <ItemSidebarStyled>
                <Link to={route.friend}>
                  <PersonVcard size={35} color="white" />
                </Link>
              </ItemSidebarStyled>

              <ItemSidebarStyled>
                <Link to={route.friendRequest}>
                  <PersonPlusFill size={35} color="white" />
                </Link>
              </ItemSidebarStyled>
        </SideBarStyled>
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>User Profile</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Container fluid>
                    {/* <Thumb>
                    <ImageSidebarStyled2 src="https://i.imgur.com/rsJjBcH.png" rounded></ImageSidebarStyled2>
                    <Icon src={icons.camera} rounded></Icon>
                    </Thumb> */}
      <Row className="justify-content-center align-items-center h-100 w-100 d-flex">
        <Col lg="6" className="mb-4 mb-lg-0 w-100">
          <Card className="mb-3" style={{ borderRadius: '.5rem' }}>
            <Row className="g-0">
              <Col md="4" className="gradient-custom text-center px-2"
                style={{ borderTopLeftRadius: '.5rem', borderBottomLeftRadius: '.5rem' }}>
                      <input type="file" ref={fileInputRef} onChange={handleImageChange} style={{ display: 'none' }} />
                <Image src={avatar ? avatar :(userInfo.avatar? userInfo.avatar : "https://i.imgur.com/rsJjBcH.png")}

                  alt="Avatar" className="my-4" style={{ width: '80px', cursor: 'pointer' }} fluid onClick={triggerFileSelectPopup}/>
                <div className="d-flex flex-column justify-content-between  align-items-center">
                {isEditing?( <Form.Control type="text" maxLength={15} value={userInfoUpdate.name} name="name" onChange={handleChange} />):
                  (<h5>{userInfoUpdate.name}</h5>)
                }
                {isEditing?
                  (<><Button style={{
                              backgroundColor: '',
                              opacity: '1',
                              transition: 'all 0.3s ease',
                              ':hover': {
                                backgroundColor: '#9E9E9E',
                                opacity: '1'
                              }
                            }} className="d-flex justify-content-evenly w-75 align-items-center m-2"
                              onClick={handleDoneClick}
                            >
                              {/* <ImageSidebarStyledEdit src={icons.edit_user}></ImageSidebarStyledEdit> */}
                              <span className="text-white">Done</span>
                            </Button><Button variant="danger" style={{
                              opacity: '1',
                              transition: 'all 0.3s ease',
                              ':hover': {
                                backgroundColor: '#9E9E9E',
                                opacity: '1'
                              }
                            }} className="d-flex justify-content-evenly w-75 align-items-center m-2"
                              onClick={handleCancleClick}
                            >
                                {/* <ImageSidebarStyledEdit src={icons.edit_user}></ImageSidebarStyledEdit> */}
                                <span className="text-white">Cancel</span>
                              </Button></>
                    ):
                  (<><Button style={{
                              backgroundColor: '',
                              opacity: '0.5',
                              transition: 'all 0.3s ease',
                              ':hover': {
                                backgroundColor: '#9E9E9E',
                                opacity: '1'
                              }
                            }} className="d-flex justify-content-evenly w-75 align-items-center m-2"
                              onClick={handleUpdateClick}
                            >
                              {/* <ImageSidebarStyledEdit src={icons.edit_user}></ImageSidebarStyledEdit> */}
                              <span className="text-white">Update</span>
                            </Button><Button variant="" style={{
                              backgroundColor: '',
                              opacity: '1',
                              transition: 'all 0.3s ease',
                              ':hover': {
                                backgroundColor: '#9E9E9E',
                                opacity: '1'
                              }
                            }} className="d-flex justify-content-evenly w-75 align-items-center m-2"
                              onClick={handleLogoutClick}
                            >
                                {/* <ImageSidebarStyledEdit src={icons.edit_user}></ImageSidebarStyledEdit> */}
                                <span className="text-black">Logout</span>
                              </Button></>)
                }
                    
                </div>
              </Col>
              <Col md="8">
                <Card.Body className="p-4">
                  <h6>Information</h6>
                  <hr className="mt-0 mb-4" />
                  <Row className="pt-1">
                    <Col sm="12" className="mb-3">
                      <h6>Email</h6>
                      <p className="text-muted">{userInfo.email}</p>
                    </Col>
                    <Col sm="6" className="mb-3">
                      <h6>Phone</h6>
                      {isEditing ? (
                        <Form.Control type="text" value={userInfoUpdate.phone}  style={{width: 'auto'}} name="phone" onChange={handleChange}/>
                      ) : (
                        <p className="text-muted">{userInfoUpdate.phone}</p>
                      )}
                    </Col>
                  </Row>

                  <hr className="mt-0 mb-4" />
                  <Row className="pt-1">
                    <Col sm="8" className="mb-3">
                      <h6>Dob</h6>
                      {isEditing ? (
                        <Form.Control type="date" value={userInfoUpdate.dob.split("-").reverse().join("-")}  style={{width: 'auto'}} name="dob" onChange={handleChange}/>
                        ) : (
                          <p className="text-muted">{userInfoUpdate.dob}</p>
                        )}
                    </Col>
                    <Col sm="4" className="mb-3">
                      <h6>Gender</h6>
                      <p className="text-muted">{userInfo.gender}</p>
                    </Col>
                    
                  </Row>

                  <div className="d-flex justify-content-start">
                    <a href="#!"><i className="fab fa-facebook me-3"></i></a>
                    <a href="#!"><i className="fab fa-twitter me-3"></i></a>
                    <a href="#!"><i className="fab fa-instagram me-3"></i></a>
                  </div>
                </Card.Body>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>
                </Container>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Close
                </Button>
            </Modal.Footer>
        </Modal>
        </>
    );
}

export default SideBar;