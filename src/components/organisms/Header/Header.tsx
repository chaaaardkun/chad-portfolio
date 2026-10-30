"use client";

import Image from "next/image";
import { useRef } from "react";
import { Icon } from "@/components/atoms/Icon/Icon";
import { SocialLinks } from "@/components/molecules/SocialLinks/SocialLinks";
import { content, profile } from "@/lib/content";
import { useAnchorScroll } from "@/hooks/useAnchorScroll";
import styles from "./Header.module.scss";

export function Header() {
  const headerRef = useRef<HTMLElement>(null);

  useAnchorScroll();
  return (
    <header ref={headerRef} className={styles.header} data-site-header>
      <div className={styles.inner}>
        <div className={styles.brand}>
          <div className={styles.logoWrapper}>
            <Image
              className={styles.logo}
              src="/logo/logo-small.svg"
              alt={profile.name}
              width={40}
              height={40}
            />
          </div>
          <SocialLinks />
        </div>

        <div className={styles.actions}>
          <a
            href="#contact"
            className={styles.mail}
            aria-label={content.site.header.emailAriaLabel}
          >
            <Icon name="mail" size={36} />
          </a>
        </div>
      </div>
    </header>
  );
}
