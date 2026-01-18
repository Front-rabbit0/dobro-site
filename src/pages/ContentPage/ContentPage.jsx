import { Card } from "@/shared/ui/Card/Card";
import { useContent } from "@/entities/content/model/useContent";

export function ContentPage({ pageKey, title }) {
  const { getPage } = useContent();
  const text = getPage(pageKey);

  return (
    <Card>
      <Card.Body>
        <h2>{title}</h2>
        <pre
          style={{
            whiteSpace: "pre-wrap",
            fontFamily: "inherit",
            lineHeight: 1.5,
          }}
        >
          {text}
        </pre>
      </Card.Body>
    </Card>
  );
}
