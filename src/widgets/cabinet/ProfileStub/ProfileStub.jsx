import { Card } from "@/shared/ui/Card/Card";

export function ProfileStub() {
  return (
    <Card>
      <Card.Body>
        <div style={{ display: "grid", gap: 8 }}>
          <strong>Профиль</strong>
          <p>
            Здесь будет редактирование профиля: ФИО, фото, контакты, описание и компетенции.
            Сделаем следующим шагом.
          </p>
        </div>
      </Card.Body>
    </Card>
  );
}
