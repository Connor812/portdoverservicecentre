import React, { useRef, useState } from "react";
import { Editor } from "@tinymce/tinymce-react";
import { Modal, Alert } from "react-bootstrap";
import { PostData } from "../utils/PostData";
import Header from "../components/Header";
import "../assets/css/dashboard.css";
import AdminHeader from "../components/AdminHeader";

const Dashboard = () => {
    const editorRef = useRef(null);
    const [show, setShow] = useState(false);
    const [content, setContent] = useState("");
    const [subject, setSubject] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [submitBtn, setSubmitBtn] = useState("Submit");
    const submitBtnRef = useRef(null);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const showPreview = () => {
        setContent(editorRef.current.getContent());
        handleShow();
    }

    const handleSend = () => {
        if (subject === "") {
            setError("Please enter email subject");
            return;
        }

        if (editorRef.current.getContent() === "") {
            setError("Please enter content");
            return;
        }

        // Send email
        PostData('send-email.php', { subject, content: editorRef.current.getContent() })
            .then((result) => {
                if (!result.status) {
                    setError(result.error);
                    resetSendButton();
                } else {
                    setSuccess("Email sent successfully");
                    resetSendButton();
                }
            })
            .catch((error) => {
                console.error("Error in handleModalSubmit:", error);
                resetSendButton();
                setError("Network error or server unavailable. Please try again later.");
            });

    }

    const resetSendButton = () => {
        setSubmitBtn("Submit");
        submitBtnRef.current.disabled = false;
    }

    return (
        <div>

            <AdminHeader />
            <div className="preview-btn-container">
                <button className="preview-btn" onClick={showPreview}>Preview</button>
            </div>

            {error && (
                <Alert variant="danger">{error}</Alert>
            )}
            {success && (
                <Alert variant="success">{success}</Alert>
            )}

            <center>
                <div style={{ maxWidth: "500px" }}>
                    <div style={{ textAlign: "left" }}>Enter Email Subject</div>
                    <input onChange={(e) => setSubject(e.target.value)} className="form-control" id="email-subject" placeholder="Enter Email Subject" type="text" />
                </div>
            </center>

            <div className="editor-wrapper">
                <div className="editor-container">
                    <Header />
                    <Editor
                        apiKey="zhb46ft1zqpmyb99d0lz5r1e5zt4nip43uccz5hw15w7voz0"
                        onInit={(evt, editor) => (editorRef.current = editor)}
                        init={{
                            height: 500,
                            menubar: true,
                            plugins: "lists link image code",
                            toolbar:
                                "undo redo | formatselect | bold italic | alignleft aligncenter alignright | bullist numlist outdent indent | link image | code",
                        }}
                    />
                </div>
            </div>
            <center>
                <button className="send-btn" ref={submitBtnRef} onClick={handleSend}>Send Email</button>
            </center>

            <Modal show={show} onHide={handleClose} centered className="preview-modal">
                <Modal.Header closeButton>
                    <Modal.Title>Preview</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Header />
                    <div dangerouslySetInnerHTML={{ __html: content }} />
                </Modal.Body>
            </Modal>

        </div>
    );
};

export default Dashboard;