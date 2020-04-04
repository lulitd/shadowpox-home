import React from "react";
import { Button, Box, Flex } from "rebass"
import PropTypes from "prop-types";
import { position, display, overflow, minHeight } from "styled-system";
import Title from "../components/Title";
class Modal extends React.Component {


    constructor(props) {
        super(props);
    }
    render() {
        return this.props.show ?
            <Flex 
            flexDirection="column"
            sx={
                {
                    backgroundColor: "black",
                    position: "absolute",
                    top: 0,
                    bottom: 0,
                    width:"100%",
                    maxWidth:"800px",
                }
            }>
                <Flex alignSelf="flex-end">
                    <Button sx={{
                        border: '3px solid white',
                        backgroundColor: 'transparent',
                        p: 3,
                        m: 3,
                        color: 'text',
                        textAlign: 'center',
                        fontWeight: '800',
                        textTransform: 'uppercase',
                        '&:hover': {
                            backgroundColor: 'text',
                            color: 'black',
                        }
                    }} onClick={this.props.onClose}>x</Button>
                </Flex>
                <Flex sx={{
                    flex: '1 1 auto',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    width: "100%",
                    justifyContent: 'center',
                    backgroundColor: "black",
                    minHeight:0,
                }}>
                    <Box pt={[2, 3]} sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        width: "100%",
                        justifyContent: 'center',
                    }} >
                        <Title
                            fontSize={[4, 5, 6]}
                            fontWeight='bold'
                            color='text'
                        >
                            {this.props.title}
                        </Title>
                    </Box>

                    <Box sx={{
                        flex: '1 1 auto',
                        display: 'flex',
                        flexDirection: 'column',
                        width: '100%',
                        maxWidth: '700px',
                        overflowY: 'auto',
                    }}
                        p={[3, 4]}
                        m={[2, 3]}>
                        {this.props.children}
                    </Box>
                </Flex>
            </Flex> : null;
    }

}

Modal.propTypes = {
    onClose: PropTypes.func.isRequired,
    show: PropTypes.bool.isRequired
};

export default Modal; 