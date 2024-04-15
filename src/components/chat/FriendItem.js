import React, {useState, useEffect} from "react";
import { ListGroup, Form} from 'react-bootstrap';
import styled from "styled-components";
import { Link } from 'react-router-dom';

const FriendItem =({friend, index, onCheck}) => {
    const [isChecked, setIsChecked] = useState(false);
    const handleItemClick = () => {
        const newCheckedState = !isChecked;
        setIsChecked(newCheckedState);
        onCheck(index, newCheckedState); // Call the callback function with the index and checked state
      };
    return (
        <StyledListGroupItem
        key={index}
        action
        onClick={handleItemClick}
        className="d-flex justify-content-between align-items-start border-0 ">
            <Form.Check className='d-flex px-3 py-2'>
            <Form.Check.Input style={{marginTop: "7px"}}
                type='radio' isValid  checked={isChecked} />
            <Form.Check.Label className='text-muted'>
                <div className="d-flex align-items-center">
                    <img src={friend.avatar} alt={friend.userName} width="30" height="30" className="mx-3" />
                    <span>{friend.userName}</span>
                </div>
            </Form.Check.Label>
            </Form.Check>
        </StyledListGroupItem>
    )
}

const StyledListGroupItem = styled(ListGroup.Item)`
border-radius:10px;
&:hover {
 background-color: 	#D3D3D3;
}
`
export default FriendItem