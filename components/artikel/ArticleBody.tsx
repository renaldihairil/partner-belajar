import { Lightbulb } from "lucide-react";
import { headingId } from "@/lib/articles";
import type { ArticleBlock } from "@/types";

/** Merender isi artikel dari blok data (paragraf, subjudul, daftar, kotak tips). */
export function ArticleBody({ blocks }: { blocks: ArticleBlock[] }) {
  return (
    <div className="article-body">
      {blocks.map((block, index) => {
        switch (block.type) {
          case "h2":
            return (
              <h2 key={index} id={headingId(block.text)} className="scroll-mt-24">
                {block.text}
              </h2>
            );
          case "list": {
            const List = block.ordered ? "ol" : "ul";
            return (
              <List key={index}>
                {block.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </List>
            );
          }
          case "tip":
            return (
              <aside key={index} className="article-tip">
                <span className="grid size-10 shrink-0 place-items-center rounded-2xl bg-brand-yellow text-on-accent">
                  <Lightbulb aria-hidden className="size-5" />
                </span>
                <div>
                  <p className="!m-0 text-sm font-bold text-ink">Tips Partner Belajar</p>
                  <p className="!mt-1 !mb-0 text-[15px]">{block.text}</p>
                </div>
              </aside>
            );
          default:
            return <p key={index}>{block.text}</p>;
        }
      })}
    </div>
  );
}
