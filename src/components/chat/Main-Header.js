import React, {useState, useEffect} from "react";
import { ListGroup, Image, Row, Col, Container, Card} from 'react-bootstrap';
import Stack from 'react-bootstrap/Stack';
import { icons } from "../../assets";
import styled from "styled-components";
import axiosClient from "../../api/axiosClient";
import { useNavigate } from "react-router-dom";

import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

// id: props
const Header = (id) => {
    const [user, setUser] = useState({});
    const [meetingId, setMeetingId] = useState();
    const navigate = useNavigate();
    var socket = id.socket;
    useEffect(() => {
        axiosClient.get("/info-user/" + id.id).then((res) => {
            const data = res.data.data;
            console.log("data", data);
            setUser(data);
        });
    }, [id.id]);
    function formatTime(milliseconds) {
        const seconds = Math.floor(milliseconds / 1000);
        if (seconds < 60) {
            return seconds + ' seconds ago';
        }
        const minutes = Math.floor(seconds / 60);
        if (minutes < 60) {
            return minutes + ' minutes ago';
        }
        const hours = Math.floor(minutes / 60);
        if (hours < 24) {
            return hours + ' hours ago';
        }
        const days = Math.floor(hours / 24);
        return days + ' days ago';
    }

    const handleCamera = () => {
        if (meetingId) {
            socket.emit('notify', { meetingId: meetingId, userId: user._id});
            window.open('/meeting/' + meetingId, '_blank');
            return;
        }
        // socket.emit('call', { chatRoomId: id.id });
        // socket.on('call', (meetingId) => {
        //     console.log('data', meetingId);
        //     setMeetingId(meetingId);
        //     window.open('/meeting/' + meetingId, '_blank');
        // });
    };
    const [show, setShow] = useState(false);
    const [userInfo, setUserInfo] = useState({});

    const handleModal = async () => {
        const res = await axiosClient.get("/profile/" + user.username);
        setUserInfo(res.data.data);
        console.log("userInfo", userInfo);
        setShow(true);
    }
    const handleClose = () => setShow(false);

    const handleBt = () => {
    };
    useEffect(() => {
    if(!meetingId){
        setMeetingId("meetingId");
        socket.emit('call', id.id);
        socket.on('call', (meetingId) => {
            console.log('MeetingHeader', meetingId);
            setMeetingId(meetingId);
        });
    }}, []);
    return (
        <><div className="p-2 border-start">
            <Stack direction="horizontal" gap={2}>
                <div className="flex-grow-1">
                    <ListGroup.Item
                        as="div"
                        className="d-flex justify-content-between align-items-start"
                        action
                    >
                        <DivImage>
                            <ImageSidebarStyled
                                src={user.photoURL}
                                roundedCircle
                                onClick={handleModal}
                                style={{ cursor: 'pointer' }}
                                />
                        </DivImage>
                        <div className="me-auto">
                            <div className="fw-bold">{user.displayName}</div>
                            <div>{user.isOnline ? 'Active' : `Active ${formatTime(Date.now() - Date.parse(user.lastOnlineTime))}`}</div>
                        </div>
                    </ListGroup.Item>
                </div>
                <div className="p-1 mx-1 image-hover">
                    <Image
                        src={icons.addGroup}
                        style={{ width: '25px', height: '25px' }} />
                </div>
                {/* <div className="p-1 mx-1 image-hover">
                    <Image
                        src={icons.search}
                        style={{ width: '25px', height: '25px' }} />
                </div> */}
                <div className="p-1 mx-1 image-hover" onClick={handleCamera}>
                    <Image
                        src={icons.video_call}
                        style={{ width: '25px', height: '25px' }} />
                </div>
                <style>
                    {`
                        .image-hover:hover {
                            transform: scale(1.2);
                            transition: transform .2s;
                        }
                        `}
                </style>
            </Stack>
        </div>
        <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>User Profile</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Container fluid>
                        <Row className="justify-content-center align-items-center h-100 w-100 d-flex">
                            <Col lg="6" className="mb-4 mb-lg-0 w-100">
                                <Card className="mb-3" style={{ borderRadius: '.5rem' }}>
                                    <Row className="g-0">
                                        <Col md="4" className="gradient-custom text-center px-2"
                                            style={{ borderTopLeftRadius: '.5rem', borderBottomLeftRadius: '.5rem' }}>
                                            <Image src={userInfo.avatar ? userInfo.avatar : "https://i.imgur.com/rsJjBcH.png"}

                                                alt="Avatar" className="my-4" style={{ width: '80px', cursor: 'pointer' }} fluid/>
                                            <div className="d-flex flex-column justify-content-between  align-items-center">
                                            <h5>{userInfo.name}</h5>
                                            <Button variant="danger" className="my-2" onClick={handleBt}>Unfriend</Button>
                                            <Button variant="none" onClick={handleBt}>Block</Button>
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
                                                        <p className="text-muted">{userInfo.phone}</p>
                                                    </Col>
                                                </Row>

                                                <hr className="mt-0 mb-4" />
                                                <Row className="pt-1">
                                                    <Col sm="8" className="mb-3">
                                                        <h6>Dob</h6>
                                                        <p className="text-muted">{userInfo.dob}</p>
                                                    </Col>
                                                    <Col sm="4" className="mb-3">
                                                        <h6>Gender</h6>
                                                        <p className="text-muted">{userInfo.gender}</p>
                                                    </Col>

                                                </Row>
                                                <hr className="mt-0 mb-4" />
                                                <Row className="pt-1">
                                                    <Col sm="8" className="mb-3">
                                                        <a className="text-muted">Manual group: ({userInfo.countCommonGroup})</a>
                                                    </Col>
                                                </Row>
                                                <div className="d-flex justify-content-start">
                                                    <a href="#!"><i className="fab fa-facebook me-3 text-black-50"></i></a>
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
            </Modal></>
    );
};

const ImageSidebarStyled = styled(Image)`
width: 50px;
margin: 0 15px;
`;

const DivImage = styled.div`
  max-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 3px 0 3px 0;
`;

export default Header;