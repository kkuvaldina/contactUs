import React from "react";
import axios from "axios";
import {
  Button,
  Input,
  Checkbox,
  Form,
  Header,
  Segment,
  Message,
} from "semantic-ui-react";

import { validate } from "../utils/FormHelper";

export const ContactUsForm = () => {
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [birthDate, setBirthDate] = React.useState("");
  const [isFormValid, setIsFormValid] = React.useState(false);
  const [emailConsent, setEmailConsent] = React.useState(false);
  const [success, setSuccess] = React.useState(false);
  const [error, setError] = React.useState(false);

  const nameRef = React.useRef();
  const emailRef = React.useRef();
  const dateRef = React.useRef();

  const handleNameChange = (e) => {
    nameRef.current.inputRef.current.reportValidity();
    setName(e.target.value);
  };

  const handleEmailChange = (e) => {
    const emailInput = emailRef.current.inputRef.current;

    if (!validate(emailInput.value)) {
      emailInput.setCustomValidity("Invalid email");
      emailInput.reportValidity();
    } else {
      emailInput.setCustomValidity("");
      emailInput.reportValidity();
    }
    setEmail(e.target.value);
  };

  const handleDateChange = (e) => {
    dateRef.current.inputRef.current.reportValidity();
    setBirthDate(e.target.value);
  };

  const handleCheckboxChange = () => {
    setEmailConsent(!emailConsent);
  };

  const handleClearButton = () => {
    setName("");
    setEmail("");
    setBirthDate("");
    setEmailConsent(false);
  };

  const handleFormSubmit = () => {
    axios
      .post(
        "https://my-json-server.typicode.com/JustUtahCoders/interview-users-api/users",
        {
          id: Math.floor(Math.random() * 10000001) + 1,
          name,
          email,
          birthDate,
          emailConsent,
        }
      )
      .then((response) => {
        setSuccess(true);
        setError(false);
        handleClearButton();
      })
      .catch((error) => {
        setError(true);
        setSuccess(false);
      });
  };

  React.useEffect(() => {
    const valuesArr = [nameRef, emailRef, dateRef];
    const areValuesValid = valuesArr.every(
      (ref) => ref.current && ref.current.inputRef.current.validity.valid
    );

    if (areValuesValid && emailConsent) {
      setIsFormValid(true);
    } else {
      setIsFormValid(false);
    }
  }, [name, email, birthDate, emailConsent]);

  return (
    <Segment raised className="main-segment">
      <Header as="h1">Contact Us</Header>
      <Form onSubmit={handleFormSubmit} error={error} success={success}>
        <Form.Field required>
          <label>Name</label>
          <Input
            ref={nameRef}
            required
            value={name}
            placeholder="Joe Smith"
            onChange={handleNameChange}
          />
        </Form.Field>
        <Form.Field required>
          <label>Email</label>
          <Input
            ref={emailRef}
            required
            type="email"
            value={email}
            placeholder="joe@smith.com"
            onChange={handleEmailChange}
          />
        </Form.Field>
        <Form.Field>
          <label>Birth Date</label>
          <Input
            type="date"
            ref={dateRef}
            value={birthDate}
            onChange={handleDateChange}
          />
        </Form.Field>
        <Form.Field required>
          <Checkbox
            checked={emailConsent}
            label="I agree to be contacted via email."
            onChange={handleCheckboxChange}
          ></Checkbox>
        </Form.Field>
        <Message
          success
          header="Thank you!"
          content="Your submission has been sent"
        />
        <Message
          error
          header="Form submission failed"
          content="There was a problem submitting the form"
        />
        <Button secondary onClick={handleClearButton}>
          Clear
        </Button>
        <Button primary disabled={!isFormValid} type="submit">
          Submit
        </Button>
      </Form>
    </Segment>
  );
};
