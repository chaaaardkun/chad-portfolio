"use client";

import { useEffect, useRef, useState } from "react";
import { Icon } from "@/components/atoms/Icon/Icon";
import { Slideshow } from "@/components/molecules/Slideshow/Slideshow";
import { type WorkItem, content } from "@/lib/content";
import { ScrollSmoother } from "@/lib/gsap";
import styles from "./ProjectModal.module.scss";

type View = "desktop" | "mobile";

type ProjectModalProps = {
  project: WorkItem | null;
  onClose: () => void;
};

const labels = content.work.modal;

/**
 * Native modal dialog that shows a project in a laptop or a phone frame. The
 * dialog gives focus trapping, Esc to close and the top layer for free. The
 * dialog element itself is a transparent full-screen layer, so a click on it
 * (outside the panel) closes the modal.
 */
export function ProjectModal({ project, onClose }: ProjectModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [view, setView] = useState<View>("desktop");
  // Plays the bubble animation only after the first click, not on open.
  const [moved, setMoved] = useState(false);
  // Keep the last project while the dialog is closing so it never flashes empty.
  const [shown, setShown] = useState<WorkItem | null>(project);

  // A newly opened project starts on the laptop view. Adjusting state while
  // rendering (not in an effect) avoids a frame with the previous project.
  if (project && project !== shown) {
    setShown(project);
    setView("desktop");
    setMoved(false);
  }

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (project) {
      if (!dialog.open) dialog.showModal();
      // The page scrolls through ScrollSmoother; pause it behind the modal.
      ScrollSmoother.get()?.paused(true);
      return () => {
        ScrollSmoother.get()?.paused(false);
      };
    }
    if (dialog.open) dialog.close();
  }, [project]);

  const views: { id: View; label: string }[] = [
    { id: "desktop", label: labels.desktopLabel },
    { id: "mobile", label: labels.mobileLabel },
  ];

  return (
    <dialog
      ref={dialogRef}
      className={styles.dialog}
      aria-label={shown?.title}
      onClose={onClose}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      {shown && (
        <div className={styles.panel}>
          <div className={styles.bar}>
            <div
              className={styles.toggle}
              role="group"
              aria-label={labels.viewLabel}
              data-view={view}
              data-moved={moved}
            >
              {views.map(({ id, label }) => (
                <button
                  key={id}
                  type="button"
                  className={styles.toggleButton}
                  aria-pressed={view === id}
                  aria-label={label}
                  title={label}
                  onClick={() => {
                    setMoved(true);
                    setView(id);
                  }}
                >
                  <Icon name={id} size={22} />
                </button>
              ))}
            </div>
            <button
              type="button"
              className={styles.close}
              aria-label={labels.closeLabel}
              onClick={onClose}
            >
              <Icon name="close" size={22} />
            </button>
          </div>

          <div className={styles.stage}>
            {/* Both devices stay mounted so switching can cross-fade between them. */}
            <div
              className={styles.laptop}
              data-active={view === "desktop"}
              aria-hidden={view !== "desktop"}
              inert={view !== "desktop"}
            >
              <div className={styles.laptopScreen}>
                <Slideshow
                  key={shown.title}
                  images={shown.desktop}
                  alt={`${shown.title}, desktop`}
                  width={1440}
                  height={900}
                  playing={project !== null && view === "desktop"}
                />
              </div>
              <div className={styles.laptopBase} />
            </div>
            <div
              className={styles.phone}
              data-active={view === "mobile"}
              aria-hidden={view !== "mobile"}
              inert={view !== "mobile"}
            >
              <div className={styles.phoneScreen}>
                <Slideshow
                  key={shown.title}
                  images={shown.mobile}
                  alt={`${shown.title}, mobile`}
                  width={780}
                  height={1688}
                  playing={project !== null && view === "mobile"}
                />
              </div>
            </div>
          </div>

          <div className={styles.info}>
            <p className={styles.title}>{shown.title}</p>
            <p className={styles.description}>{shown.description}</p>
            <a
              className={styles.link}
              href={shown.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${labels.visitLabel}: ${shown.title} (${labels.newTabLabel})`}
            >
              {labels.visitLabel}
            </a>
          </div>
        </div>
      )}
    </dialog>
  );
}
