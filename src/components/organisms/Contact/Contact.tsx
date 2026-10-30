"use client";

import { type FormEvent, useState } from "react";
import { Button } from "@/components/atoms/Button/Button";
import { SectionHeading } from "@/components/atoms/SectionHeading/SectionHeading";
import { TextArea } from "@/components/atoms/TextArea/TextArea";
import { TextInput } from "@/components/atoms/TextInput/TextInput";
import { FormField } from "@/components/molecules/FormField/FormField";
import { content, fill, profile } from "@/lib/content";
import { Reveal } from "@/components/atoms/Reveal/Reveal";
import styles from "./Contact.module.scss";

const { intents: INTENTS, fields } = content.contact;

type Intent = string;

export function Contact() {
  const [intent, setIntent] = useState<Intent>(INTENTS[0].value);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const intentLabel = INTENTS.find((item) => item.value === intent)?.label;
    const subject = encodeURIComponent(
      fill(content.contact.mailto.subject, { intent: intentLabel ?? "", name }),
    );
    const body = encodeURIComponent(fill(content.contact.mailto.body, { message, name, email }));
    window.location.href = `mailto:${profile.email}?subject=${subject}&body=${body}`;
  };

  return (
    <section id="contact" className={styles.section}>
      <SectionHeading eyebrow={content.contact.eyebrow} title={content.contact.title} />

      <form className={styles.form} onSubmit={handleSubmit}>
        <fieldset className={styles.chips}>
          <legend className={styles.legend}>{content.contact.intentLegend}</legend>
          {INTENTS.map((item) => (
            <label key={item.value} className={styles.chip}>
              <input
                type="radio"
                name="intent"
                value={item.value}
                checked={intent === item.value}
                onChange={() => setIntent(item.value)}
                className={styles.radio}
              />
              {item.label}
            </label>
          ))}
        </fieldset>

        <div className={styles.row}>
          <FormField label={fields.name.label} htmlFor="contact-name">
            <TextInput
              className={styles.input}
              id="contact-name"
              name="name"
              autoComplete="name"
              placeholder={fields.name.placeholder}
              value={name}
              onChange={(event) => setName(event.target.value)}
              required
            />
          </FormField>
          <FormField label={fields.email.label} htmlFor="contact-email">
            <TextInput
              className={styles.input}
              id="contact-email"
              name="email"
              type="email"
              autoComplete="email"
              placeholder={fields.email.placeholder}
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </FormField>
        </div>

        <FormField label={fields.message.label} htmlFor="contact-message">
          <TextArea
            className={styles.input}
            rows={4}
            id="contact-message"
            name="message"
            placeholder={fields.message.placeholder}
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            required
          />
        </FormField>

        <div className={styles.actions}>
          <Button type="submit" className={styles.submit}>
            {content.contact.submitLabel}
          </Button>
          <Reveal as="span" className={styles.hint}>
            {content.contact.hint}
          </Reveal>
        </div>
      </form>
    </section>
  );
}
