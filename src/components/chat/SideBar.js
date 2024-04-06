import  React, { useState, useEffect, useContext, useRef }  from "react";
import { Image, Container, Row, Col, Card, Form  } from 'react-bootstrap';
import { ChatDotsFill, PersonVcard } from 'react-bootstrap-icons';
import 'bootstrap/dist/css/bootstrap.min.css';
import styled from "styled-components";
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
// import { icons } from "../../assets";
import axiosClient from '../../api/axiosClient';
import {AuthToken} from '../../authToken/index'
import route from '../../configs/route'
import { useNavigate } from 'react-router-dom';

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
    width: 60%;
`
// const Icon = styled(Image)`
//     width: 25px;
//     position: absolute;
//     bottom: -10px;
//     left: 70px;

// `
// const ImageSidebarStyled2 = styled(Image)`
//     width: 20%;
//     position: absolute;
//     bottom: -20px;

// `
// const Thumb = styled.div`
//     background-image: url('https://i.imgur.com/rsJjBcH.png');
//     background-size: cover;
//     background-position: center;
//     height: 200px;
//     width: 100%;
//     border-radius: 10px;
//     margin-bottom: 20px;
//     position: relative;
// `

const SideBar = () => {
    // console.log(123);
    const fileInputRef = useRef();
    const [avatar, setAvatar] = useState(''); // Add this line
    const [show, setShow] = useState(false);
    const [userInfo, setUserInfo] = useState({});
    const [isEditing, setIsEditing] = useState(false);
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
    };
    const handleChange = (e) => {
      const { name, value } = e.target;
      setUserInfo(prevState => ({
        ...prevState,
        [name]: value
      }));
      console.log(userInfo);
    };
    
    const handleImageChange = (event) => {
      if (event.target.files && event.target.files[0]) {
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
      
      // Send the image file to the server
      if (avatar) {
        const formData = new FormData();
        formData.append('avatar', avatar);
        console.log('formData:', formData);
        try {
          const response = await axiosClient.post('/profile/avatar', formData, {
            headers: {
              'Content-Type': 'image/png',
              
            }
          });
          //code backend save to s3:
          // router.post("/profile/avatar", authenticateJWT, updateAvatar);
          // const updateAvatar = async (req, res) => {
          //   const { id } = req.user;
          //   const file = req.files.avatar;
          //   const fileName = `avatar-${id}-${Date.now()}.png`;
          //   const filePath = `avatars/${fileName}`;
          //   const params = {
          //     Bucket: process.env.AWS_BUCKET_NAME,
          //     Key: filePath,
          //     Body: file.data,
          //     ACL: 'public-read',

          //   };
          //   s3.upload(params, async (err, data) => { 
          //     if (err) {
          //       console.log('Error uploading image:', err);
          //       return res.status(500).json({ message: 'Failed to upload image' });
          //     }
          //     const avatarUrl = data.Location;
          //     const user = await
          //     User.findByIdAndUpdate(id, { avatar: avatarUrl }, { new: true });
          //     res.status(200).json({ data: user });
          //   });
          // };
          //-> res.files : undefined 
          //-> res.files.avatar : undefined
          //-> res.files.avatar[0] : undefined
          // fix: 
          // const upload = multer({ storage: storage }).single('avatar');
          // const updateAvatar = async (req, res) => {
          //   upload(req, res, async (err) => {
          //     if (err) {
          //       console.log('Error uploading image:', err);
          //       return res.status(500).json({ message: 'Failed to upload image' });
          //     }
          //     const { id } = req.user;
          //     const file = req.file;

          if (response.ok) {
          console.log('Image uploaded successfully');
          } else {
          console.log('Failed to upload image');
          }
        } catch (error) {
          console.log('Error uploading image:', error);
        }
      }
      setIsEditing(false);
      console.log("Updated UserInfo:", userInfo);
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
                <ChatDotsFill size={35} color="white" />
            </ItemSidebarStyled>

            <ItemSidebarStyled>
                <PersonVcard size={35} color="white" />
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
              <Col md="4" className="gradient-custom text-center px-3"
                style={{ borderTopLeftRadius: '.5rem', borderBottomLeftRadius: '.5rem' }}>
                      <input type="file" ref={fileInputRef} onChange={handleImageChange} style={{ display: 'none' }} />
                <Image src={userInfo.avatar? userInfo.avatar : (avatar ? avatar : "https://i.imgur.com/rsJjBcH.png")}

                  alt="Avatar" className="my-4" style={{ width: '80px', cursor: 'pointer' }} fluid onClick={triggerFileSelectPopup}/>
                <div className="d-flex flex-column justify-content-between  align-items-center">
                {isEditing?( <Form.Control type="text" value={userInfo.name} onChange={handleChange} />):
                  (<h5>{userInfo.name}</h5>)
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
                        <Form.Control type="text" value={userInfo.phone} onChange={handleChange} style={{width: 'auto'}}/>
                      ) : (
                        <p className="text-muted">{userInfo.phone}</p>
                      )}
                    </Col>
                  </Row>

                  <hr className="mt-0 mb-4" />
                  <Row className="pt-1">
                    <Col sm="8" className="mb-3">
                      <h6>Dob</h6>
                      {isEditing ? (
                        <Form.Control type="date" value={userInfo.dob} onChange={handleChange} style={{width: 'auto'}}/>
                        ) : (
                          <p className="text-muted">{userInfo.dob}</p>
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