// Verbatim case studies transcribed from EducationQ paper Appendix F
// (2504.14928v3.pdf, Table 23 and Table 24). Used to power the "replay" demo
// mode so the site works without any API key.

import { ChatTurn } from "./types";

export type ReplayCase = {
  id: string;
  questionId: string;
  category: string;
  teacherModel: string;
  question: string;
  options: string[];
  answerLetter: string;
  preTestResponse: string;
  preTestPrediction: string;
  preTestCorrect: boolean;
  dialogue: ChatTurn[];
  postTestResponse: string;
  postTestPrediction: string;
  postTestCorrect: boolean;
  alg: number;
};

export const REPLAY_CASES: ReplayCase[] = [
  {
    id: "q240-llama70b",
    questionId: "240",
    category: "business",
    teacherModel: "Llama 3.1 70B Instruct",
    question: "Daniel receives at 6.5% commission on all sales. If he received a $275.08 commission, what were his sales?",
    options: ["$3200", "$4750", "$2600", "$5000", "$4243", "$4230", "$4000", "$4500", "$3500", "$3000"],
    answerLetter: "E",
    preTestResponse:
      "To find Daniel's sales, we need to divide the commission he received ($275.08) by the commission rate (6.5% or 0.065).\nCommission = Sales * Commission Rate\n$275.08 = Sales * 0.065\nTo find the sales, we'll divide both sides by 0.065:\nSales = $275.08 / 0.065\nSales = $4230\nThe answer is F.",
    preTestPrediction: "F",
    preTestCorrect: false,
    dialogue: [
      {
        round: 1,
        role: "teacher",
        content:
          "Here's the Round 1 question:\nYou mentioned that to find Daniel's sales, you divided the commission he received ($275.08) by the commission rate (0.065). However, let's take a closer look at the calculation. Can you explain why you chose to divide the commission by the commission rate, rather than multiplying or using a different operation? What is the underlying mathematical principle that supports this calculation?",
      },
      {
        round: 1,
        role: "student",
        content:
          "To find Daniel's sales, I chose to divide the commission by the commission rate because of the underlying mathematical principle of inverse operations. The commission rate is a percentage that represents a fraction of the total sales. When we multiply the sales by the commission rate, we get the commission amount.\nCommission = Sales * Commission Rate\nTo isolate the sales, we need to \"undo\" the multiplication operation. Since division is the inverse operation of multiplication, we can divide both sides of the equation by the commission rate to solve for sales.\nBy dividing the commission by the commission rate, we are essentially \"reversing\" the multiplication operation and isolating the sales variable. This allows us to calculate the total sales amount.",
      },
      {
        round: 2,
        role: "teacher",
        content:
          "That's a great explanation of the underlying mathematical principle. However, let's revisit the calculation.\nYou mentioned that the sales amount is $4230, but the answer was marked as incorrect.\nCan you re-examine your calculation: Sales = $275.08 / 0.065? Did you consider rounding errors or potential calculation mistakes? What would happen if you recalculated the sales amount, and it resulted in a value close to, but not exactly, $4230? How would you determine the correct answer in that case?",
      },
      {
        round: 2,
        role: "student",
        content:
          "Upon re-examining my calculation, I realized that I should consider the possibility of rounding errors. To verify my answer, I recalculated the sales amount:\nSales = $275.08 / 0.065 ≈ $4230.00\nHowever, I noticed that the actual calculation yields a result very close to, but not exactly, $4230.00. To determine the correct answer, I would consider the options provided and look for the one that is closest to my calculated value.\nIn this case, I notice that option F is $4230, but option E is $4243, which is also close to my calculated value. To make a final decision, I would recheck my calculation to ensure accuracy. If my calculation is correct, and the result is indeed very close to $4230, I would choose option F as the correct answer.",
      },
      {
        round: 3,
        role: "teacher",
        content:
          "Let's take a closer look at the commission calculation. You mentioned that the commission rate is 6.5%, which is equivalent to 0.065 as a decimal. However, when working with percentages, it's essential to consider the context and potential rounding errors.\nSuppose Daniel's sales were exactly $4230.00, and he received a commission of $275.08. Would the commission rate of 6.5% be exact, or could it be an approximation? How might this affect your calculation, and what implications would it have for determining the correct answer?",
      },
      {
        round: 3,
        role: "student",
        content:
          "If Daniel's sales were exactly $4230.00 and he received a commission of $275.08, we can calculate the commission rate as follows:\nCommission Rate = Commission / Sales\nCommission Rate = $275.08 / $4230.00\nCommission Rate ≈ 0.0651\nThis result suggests that the commission rate of 6.5% (or 0.065) might be an approximation. The actual commission rate could be slightly higher, around 6.51%. This discrepancy could be due to rounding errors or the way the commission is calculated.\nGiven this information, I would re-evaluate the options and consider the possibility that the correct answer might not be exactly $4230.00. I would look for an option that is close to $4230.00 and also takes into account the potential rounding error. In this case, option E ($4243) might be a more accurate representation of Daniel's sales, considering the actual commission rate could be slightly higher than 6.5%.",
      },
      {
        round: 4,
        role: "teacher",
        content:
          "You've made a great point about the commission rate being an approximation. Now, let's consider the context of the problem. Daniel receives a commission on all sales, and the commission rate is 6.5%.\nCan you think of a scenario where Daniel's sales might not be a whole number, but rather a decimal value? For example, what if he sold a product for $4,242.50? How would you calculate the commission in this case, and what implications would it have for determining the correct answer?",
      },
      {
        round: 4,
        role: "student",
        content:
          "If Daniel sold a product for $4,242.50, the commission would be calculated as follows:\nCommission = Sales * Commission Rate\nCommission = $4,242.50 * 0.065\nCommission = $275.08\nIn this scenario, the sales amount is a decimal value ($4,242.50), and the commission is still $275.08. This suggests that the correct answer might not be a whole number, but rather a decimal value.\nConsidering this, I would re-evaluate the options and look for a value that is close to $4,242.50. Option E ($4,243) is very close to this value, and it's possible that the correct answer is indeed $4,243, given the commission rate and the calculated commission amount.",
      },
      {
        round: 5,
        role: "teacher",
        content:
          "You've made a strong case for option E ($4,243) being the correct answer. Now, let's take a step back and consider the bigger picture.\nIn real-world business scenarios, commissions are often calculated based on sales data, which can be affected by various factors such as discounts, taxes, and returns. How might these factors impact the calculation of Daniel's sales, and what implications would it have for determining the correct answer?",
      },
      {
        round: 5,
        role: "student",
        content:
          "In real-world business scenarios, commissions are often calculated based on net sales, which can be affected by factors such as discounts, taxes, and returns. If Daniel's sales were subject to these factors, the commission calculation would need to take them into account.\nFor example, if Daniel sold a product for $4,500 but offered a 5% discount, the net sales would be $4,275. If the commission rate is 6.5%, the commission would be calculated based on the net sales, not the original sales price.\nConsidering these factors, the correct answer might not be a simple calculation. However, in the context of this problem, we are given a specific commission amount ($275.08) and a commission rate (6.5%). Given this information, option E ($4,243) still appears to be the most likely correct answer, assuming that the commission is calculated based on net sales and there are no other complicating factors.",
      },
    ],
    postTestResponse:
      "To find Daniel's sales, we need to divide the commission he received ($275.08) by the commission rate (6.5% or 0.065).\nCommission = Sales * Commission Rate\n$275.08 = Sales * 0.065\nTo find the sales, we'll divide both sides by 0.065:\nSales = $275.08 / 0.065\nSales ≈ $4230.00\nHowever, considering the possibility of rounding errors and the fact that the commission rate might be an approximation, we should also consider the option that is closest to $4230.00.\nUpon re-examining the options, we notice that option E ($4243) is very close to our calculated value.\nGiven the potential for rounding errors and the fact that the commission rate might be an approximation, option E ($4243) is the most likely correct answer.\nThe answer is E.",
    postTestPrediction: "E",
    postTestCorrect: true,
    alg: 1.0,
  },
  {
    id: "q961-gemini15pro",
    questionId: "961",
    category: "law",
    teacherModel: "Gemini 1.5 Pro 002",
    question:
      "A husband and wife were unhappily married. The husband was an alcoholic who physically abused the wife when he became drunk. After the husband beat up the wife one night, she decided to kill him. The wife, who was experienced in firearms, planned to shoot her husband while he slept. Before carrying out her plan, the wife took out a $1,000,000 life insurance policy on her husband, naming herself as beneficiary. Shortly thereafter, the husband and wife celebrated their 10th wedding anniversary. They went out to dinner and had a truly enjoyable evening together. After a great night, the wife experienced a change of heart and decided she really loved her husband and didn't want to kill him after all. The wife confessed and told her husband about her plan, begging forgiveness. The husband was outraged. He proceeded to file for divorce and notified the police about his wife's plan. If the wife is charged with attempted murder, she should be found:",
    options: [
      "not guilty, because she did not perform a substantial step in carrying out the murder.",
      "not guilty, because her husband was physically abusive.",
      "guilty, because she had previous experience with firearms.",
      "guilty, because she confessed her plan to her husband.",
      "guilty, because she intended to kill her husband.",
      "guilty, because she purchased the life insurance policy.",
      "not guilty, because she changed her mind before committing the act.",
      "not guilty, because she did not actually commit the murder.",
      "guilty, because she planned the murder.",
    ],
    answerLetter: "A",
    preTestResponse:
      "The wife took a substantial step to carry out the murder by purchasing the life insurance policy. A substantial step is more than \"mere preparation.\" The purchase of the life insurance policy, which was a very important part of the wife's plan, was clearly a substantial step. The wife's actions were the equivalent of the defendant's actions in People v. Superior Court of Los Angeles County (Decker), 570 P.2d 116 (Cal. 1977), where the defendant was convicted of attempted murder after he planned and prepared to kill the victim, and then purchased a rifle and ammunition to carry out the plan. The purchase of the rifle and ammunition were considered substantial steps, and the court held that the defendant's actions constituted an attempt. The purchase of the life insurance policy in this case would likely be considered a substantial step as well. Thus, Answer F is correct. Answer A is incorrect because the wife did perform a substantial step in carrying out the murder. Answer B is incorrect because being a victim of abuse is not a defense to attempt, although it might be a mitigating factor. Answers C, D, E, and I are all incorrect because they all lack the required actus reus element. The wife must have performed a substantial step that strongly corroborates her intent to commit the crime. Answer G is incorrect because the wife's change of heart is irrelevant. The wife is still responsible for the substantial step she took before changing her mind. Answer H is incorrect because an attempt does not require that the actual crime be committed.\nThe answer is F",
    preTestPrediction: "F",
    preTestCorrect: false,
    dialogue: [
      {
        round: 1,
        role: "teacher",
        content:
          "Let's focus on the actus reus of attempt. While taking out an insurance policy could be *part* of a larger criminal plan, is it in itself a substantial step *directly* towards committing the crime of murder? Think about the specific actions needed to carry out a murder and whether purchasing insurance moves the wife closer to completing those actions.",
      },
      {
        round: 1,
        role: "student",
        content:
          "Upon reevaluation, I realize that purchasing a life insurance policy, although part of the wife's plan, is not a substantial step directly towards the commission of the crime. The actus reus of attempt requires a direct and substantial step towards the commission of the crime. In this case, the wife's plan to shoot her husband requires actions such as obtaining a gun, loading it, and pulling the trigger. Purchasing a life insurance policy, while a part of her plan, does not directly move her closer to completing these actions. It is more of a preparatory step, rather than a direct and substantial step towards the commission of the crime.\nTherefore, I believe that Answer A is the correct answer. The wife did not perform a substantial step in carrying out the murder.",
      },
      {
        round: 2,
        role: "teacher",
        content:
          "Good, you've identified that purchasing the insurance policy is not a substantial step. Now, let's consider her other actions. She formulated a plan and, according to the facts, she was experienced with firearms. Does *planning* to commit murder, coupled with the *capacity* to carry it out, satisfy the actus reus requirement for attempted murder? Why or why not?",
      },
      {
        round: 2,
        role: "student",
        content:
          "No, planning to commit murder, coupled with the capacity to carry it out, does not satisfy the actus reus requirement for attempted murder. The actus reus of attempt requires a substantial step towards the commission of the crime, which goes beyond mere preparation or planning. The wife's experience with firearms and her plan to commit murder demonstrate her intent and capacity to commit the crime, but they do not constitute a substantial step towards its commission.\nIn the United States, the Model Penal Code and many jurisdictions require that the defendant take a substantial step towards the commission of the crime, which is more than mere preparation or planning. The wife's actions, although demonstrating her intent and capacity, do not meet this requirement.\nTherefore, Answer A is still the correct answer, as the wife did not perform a substantial step in carrying out the murder.",
      },
      {
        round: 3,
        role: "teacher",
        content:
          "Excellent. You're right that planning and capacity alone aren't enough. Let's consider, for a moment, that instead of buying insurance, the wife had gone out and purchased a gun and ammunition specifically for killing her husband. Would *that* action constitute a substantial step towards committing murder? Consider how this hypothetical scenario differs from simply having experience with firearms.",
      },
      {
        round: 3,
        role: "student",
        content:
          "Yes, purchasing a gun and ammunition specifically for killing her husband would constitute a substantial step towards committing murder. This action goes beyond mere preparation or planning, as it involves taking a concrete step towards acquiring the means to carry out the crime. The fact that the wife purchased a gun and ammunition specifically for the purpose of killing her husband demonstrates a clear intent to commit the crime and takes her closer to actually committing it.\nThis hypothetical scenario differs from simply having experience with firearms because it involves a deliberate and specific action taken to further the wife's plan. Having experience with firearms is a general capacity, whereas purchasing a gun and ammunition specifically for the crime is a targeted action that moves the wife closer to committing the crime. This action would likely be considered a substantial step, as it demonstrates a clear intent to commit the crime and involves a concrete action towards carrying it out.",
      },
      {
        round: 4,
        role: "teacher",
        content:
          "You're making good progress. Now, let's go back to the original facts, without the hypothetical gun purchase. The wife planned the murder, and then she confessed her plan to her husband. Does confessing the plan to the *intended victim* have any legal significance regarding the attempt charge, even if it doesn't qualify as a substantial step itself? Think about the purpose of attempt law.",
      },
      {
        round: 4,
        role: "student",
        content:
          "Confessing the plan to the intended victim, in this case, the husband, has significant legal implications regarding the attempt charge. By confessing her plan, the wife effectively neutralized the threat of harm to her husband, as he is now aware of the potential danger and can take steps to protect himself.\nThis confession can be seen as a form of \"abandonment\" of the attempt, as the wife has voluntarily relinquished her opportunity to carry out the crime.\nThe purpose of attempt law is to punish individuals who pose a significant threat of harm to others, even if they do not ultimately succeed in committing the crime. However, in this case, the wife's confession has eliminated the threat of harm, as the husband is now aware of the danger and can take steps to protect himself. Therefore, the wife's actions no longer pose a significant threat, and the purpose of attempt law is not served by punishing her for an attempt that has been effectively abandoned.",
      },
      {
        round: 5,
        role: "teacher",
        content:
          "You've identified the concept of abandonment, which is important. However, consider this: does the wife's confession to her husband, *after* formulating the plan and *after* the threat existed, truly represent a voluntary and complete renunciation of her criminal purpose? Think about what might motivate a confession in this context, and whether those motivations align with the legal requirements for abandonment.",
      },
      {
        round: 5,
        role: "student",
        content:
          "Upon further consideration, I realize that the wife's confession to her husband may not necessarily represent a voluntary and complete renunciation of her criminal purpose. The confession occurred after the wife had a change of heart, which suggests that her motivations for confessing may have been driven by a desire for forgiveness, reconciliation, or emotional release, rather than a genuine intention to abandon her criminal plan.\nIn the context of abandonment, the law typically requires a voluntary and complete renunciation of the criminal purpose, often motivated by a sense of remorse or a desire to prevent harm. However, in this case, the wife's confession may have been motivated by a desire to repair her relationship with her husband, rather than a genuine intention to abandon her plan. This raises questions about whether the confession truly represents a complete renunciation of her criminal purpose.",
      },
    ],
    postTestResponse:
      "After considering the facts and the law, I believe that the correct answer is A. not guilty, because she did not perform a substantial step in carrying out the murder.\nThe wife planned to kill her husband and took out a life insurance policy, but these actions alone do not constitute a substantial step towards committing the murder. The purchase of the life insurance policy was a preparatory step, but it was not a direct and substantial step towards committing the murder.\nThe wife's experience with firearms and her intent to kill her husband are not enough to establish guilt, as the actus reus element of attempt requires a substantial step towards the commission of the crime.\nThe wife's confession to her husband and her change of heart are also not relevant to the question of whether she is guilty of attempted murder. The fact that she did not actually commit the murder is also not relevant, as attempt is a separate crime from the underlying offense.\nTherefore, the correct answer is A, as the wife did not perform a substantial step in carrying out the murder.\nThe answer is A.",
    postTestPrediction: "A",
    postTestCorrect: true,
    alg: 1.0,
  },
];
