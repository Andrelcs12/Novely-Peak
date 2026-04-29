

type Props = {
  data: {
    title: string;
    description: string;
    image: string;
  };
};

export default function OnboardingStep({ data }: Props) {
  return (
    <div className="flex flex-col md:flex-row items-center justify-center gap-10 w-full max-w-5xl">
      
      {/* IMAGEM */}
      <div className="flex justify-center w-full md:w-1/2">
        <img
          src={data.image}
          alt={data.title}
          className="w-56 md:w-96"
        />
      </div>

      {/* TEXTO */}
      <div className="flex flex-col items-center md:items-start text-center md:text-left gap-4 w-full md:w-1/2">
        <h1 className="text-2xl md:text-4xl font-bold text-purple-800">
          {data.title}
        </h1>
        <p className="text-purple-800/80 max-w-md">
          {data.description}
        </p>
      </div>

    </div>
  );
}


