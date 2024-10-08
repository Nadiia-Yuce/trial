import Description from "./components/Description/Description";
import Feedback from "./components/Feedback/Feedback";
import Options from "./components/Options/Options";
import Notification from "./components/Notification/Notification";
import { useState, useEffect } from "react";

//Функція для отримання значеня з локал стореджу (або надавання дефолтного) як початкового для стану компоненту
function getInitialOptions() {
  const savedOptions = window.localStorage.getItem("savedOptions");
  return savedOptions !== null
    ? JSON.parse(savedOptions)
    : {
        good: 0,
        neutral: 0,
        bad: 0,
      };
}

export default function App() {
  //Оголошення стану, який буде локально фіксувати зміни з початковим значенням - результатом фиконання функції
  const [options, setOptions] = useState(getInitialOptions);

  //Записуємо актуальний стан компонента після оновлення в локал сторедж
  useEffect(() => {
    window.localStorage.setItem("savedOptions", JSON.stringify(options));
  }, [options]);

  //Підрахунок загальної кількості фідбеків
  const totalFeedback = options.good + options.neutral + options.bad;

  //При зміні властивості об'єкту або масиву преба обов'язково робити копію (через ...) для уникнення мутації і втрати значень
  function updateFeedback(feedbackType) {
    setOptions({ ...options, [feedbackType]: options[feedbackType] + 1 });
  }

  //Функція скидання значень фідбеку
  function resetFeedback() {
    setOptions({
      good: 0,
      neutral: 0,
      bad: 0,
    });
  }

  return (
    <div>
      <Description />
      <Options update={updateFeedback} type="good">
        Good
      </Options>
      <Options update={updateFeedback} type="neutral">
        Neutral
      </Options>
      <Options update={updateFeedback} type="bad">
        Bad
      </Options>
      {totalFeedback > 0 && (
        <Options reset={resetFeedback} action="reset">
          Reset
        </Options>
      )}
      {totalFeedback ? (
        <Feedback options={options} total={totalFeedback} />
      ) : (
        <Notification />
      )}
    </div>
  );
}
