function calculate() {
 const power = parseFloat(document.getElementById('power').value);
 const deltaT = parseFloat(document.getElementById('delta-t').value);
 const material = document.getElementById('material').value;
 const diameter = parseFloat(document.getElementById('diameter').value) / 1000;
 const length = parseFloat(document.getElementById('length').value);

 const elbows90 = parseInt(document.getElementById('elbows90').value) || 0;
 const tees = parseInt(document.getElementById('tees').value) || 0;
 const valves = parseInt(document.getElementById('valves').value) || 0;

 const heLoss = parseFloat(document.getElementById('he-loss').value) || 0;
 const valve3wayLoss = parseFloat(document.getElementById('valve3way-loss').value) || 0;
 const filterLoss = parseFloat(document.getElementById('filter-loss').value) || 0;
 const checkValveLoss = parseFloat(document.getElementById('check-valve-loss').value) || 0;

 if (isNaN(power) || isNaN(deltaT) || isNaN(diameter) || isNaN(length) || deltaT === 0 || diameter <= 0) {
 document.getElementById('result').innerText = "Будь ласка, заповніть усі поля коректно.";
 return;
 }

 const roughnesses = {
 'ppr': 0.007,
 'steel': 0.05,
 'metal-plastic': 0.007,
 'copper': 0.0015,
 'stainless': 0.015
 };

 const epsilon = roughnesses[material] / 1000;
 const c = 4.187; 
 const G = power / (c * deltaT); 
 const G_m3h = G * 3.6; 
 const area = Math.PI * Math.pow(diameter, 2) / 4;
 const density = 988; 
 const velocity = (G / density) / area;
 const viscosity = 0.553e-6; 
 const Re = (velocity * diameter) / viscosity;

 let f;
 if (Re < 2300) {
 f = 64 / Re; 
 } else {
 const relativeRoughness = epsilon / diameter;
 f = 0.25 / Math.pow(Math.log10(relativeRoughness / 3.7 + 5.74 / Math.pow(Re, 0.9)), 2);
 }

 const K_elbow90 = 0.9;
 const K_tee = 1.5;
 const K_valve = 0.2;

 const totalK = (elbows90 * K_elbow90) + (tees * K_tee) + (valves * K_valve);

 const g = 9.81;
 const headLoss = (f * (length / diameter) + totalK) * (Math.pow(velocity, 2) / (2 * g));

 const totalHeadLoss = headLoss + heLoss + valve3wayLoss + filterLoss + checkValveLoss;

 document.getElementById('result').innerText = `Витрата води: ${G_m3h.toFixed(2)} м³/год. Втрати напору: ${totalHeadLoss.toFixed(2)} м.в.ст.`;
}