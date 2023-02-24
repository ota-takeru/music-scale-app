import supabase from '@/utils/supabase'

export const fetchKey = async (key, scale) => {
  const data = {}
  // const { data, error } = await supabase.from('key-scale').select()
  console.log(data)
  return data
}

export const fetchKeyWithNote = async (array) => {
  // console.log(array);
  // let a = "supabase.from('KeyAndScale').select('*')";
  // for (let i = 0; i < Object.keys(array).length; i++) {
  //   if(Object.values(array)[i+2] === "true") {
  //     a += `.eq('${Object.keys(array)[i]}',${Object.values(array)[i]})`;
  //   }
  // }
  // const { data, error } = await eval(a);
  // const myFunction = new Function(a);
  // const {data} = await myFunction()
  // if (error) {
  //   console.log(error);
  //   return;
  // }
  // console.log(data);
  // return data;
}
