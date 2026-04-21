import React from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

interface ArticleEditorProps {
  content: string;
  setContent: (content: string) => void;
}

const ArticleEditor: React.FC<ArticleEditorProps> = ({ content, setContent }) => {
  // Настройка модулей
  const modules = {
    toolbar: [
      ["bold", "italic", "underline", "strike"], // Форматирование текста
      ["blockquote", "code-block"], // Блоки
      [{ header: 1 }, { header: 2 }], // Заголовки
      [{ list: "ordered" }, { list: "bullet" }], // Списки
      [{ script: "sub" }, { script: "super" }], // Надстрочные и подстрочные символы
      [{ indent: "-1" }, { indent: "+1" }], // Отступы
      [{ direction: "rtl" }], // Направление текста
      [{ size: ["small", false, "large", "huge"] }], // Размер текста
      [{ header: [1, 2, 3, 4, 5, 6, false] }], // Заголовки
      [{ color: [] }, { background: [] }], // Цвет текста и фона
      [{ font: [] }], // Шрифты
      [{ align: [] }], // Выравнивание
      ["clean"], // Очистка форматирования
      ["link", "image"], // Ссылки и изображения
    ],
  };

  // Настройка форматов
  const formats = [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "blockquote",
    "code-block",
    "list",
    "bullet",
    "script",
    "indent",
    "direction",
    "size",
    "color",
    "background",
    "font",
    "align",
    "link",
    "image",
  ];

  return (
    <div>
      <ReactQuill
        value={content}
        onChange={setContent}
        modules={modules} // Подключаем модули
        formats={formats}
        placeholder="Напишите свою статью..."
        style={{ color: "white", margin: '2% 0'}}
      />
    </div>
  );
};

export default ArticleEditor;