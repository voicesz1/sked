# 📱 Integração com Android (Kotlin)

Este guia mostra como integrar o backend com um aplicativo Android desenvolvido em Kotlin.

## 🔗 Base URL

```kotlin
const val BASE_URL = "http://seu-ip:3000"
// Para emulador: "http://10.0.2.2:3000"
// Para dispositivo físico: "http://192.168.1.X:3000"
```

## 📦 Dependências (build.gradle)

```kotlin
dependencies {
    // Retrofit para requisições HTTP
    implementation("com.squareup.retrofit2:retrofit:2.9.0")
    implementation("com.squareup.retrofit2:converter-gson:2.9.0")
    
    // OkHttp para interceptors
    implementation("com.squareup.okhttp3:okhttp:4.12.0")
    implementation("com.squareup.okhttp3:logging-interceptor:4.12.0")
    
    // Coroutines
    implementation("org.jetbrains.kotlinx:kotlinx-coroutines-android:1.7.3")
}
```

## 🔐 Modelos de Dados

### AuthResponse.kt
```kotlin
data class AuthResponse(
    val access_token: String,
    val empresa: EmpresaResponse
)

data class EmpresaResponse(
    val id: String,
    val nome: String,
    val email: String,
    val linkUnico: String
)
```

### LoginRequest.kt
```kotlin
data class LoginRequest(
    val email: String,
    val senha: String
)
```

### Servico.kt
```kotlin
data class Servico(
    val id: String,
    val nome: String,
    val descricao: String?,
    val preco: Double,
    val duracao: Int,
    val categoria: String?,
    val foto: String?,
    val ativo: Boolean
)
```

### Funcionario.kt
```kotlin
data class Funcionario(
    val id: String,
    val nome: String,
    val especialidade: String?,
    val foto: String?,
    val telefone: String?,
    val email: String?,
    val bio: String?,
    val ativo: Boolean
)
```

### Agendamento.kt
```kotlin
data class Agendamento(
    val id: String,
    val servicoId: String,
    val funcionarioId: String,
    val clienteNome: String,
    val clienteEmail: String?,
    val clienteTelefone: String?,
    val dataHora: String,
    val status: String,
    val observacoes: String?,
    val servico: Servico?,
    val funcionario: Funcionario?
)

data class CreateAgendamentoRequest(
    val servicoId: String,
    val funcionarioId: String,
    val clienteNome: String,
    val clienteEmail: String?,
    val clienteTelefone: String?,
    val dataHora: String,
    val observacoes: String?
)
```

## 🌐 Interface da API (Retrofit)

### ApiService.kt
```kotlin
import retrofit2.Response
import retrofit2.http.*

interface ApiService {
    
    // Autenticação
    @POST("auth/login")
    suspend fun login(@Body request: LoginRequest): Response<AuthResponse>
    
    @POST("auth/register")
    suspend fun register(@Body request: RegisterRequest): Response<AuthResponse>
    
    // Serviços
    @GET("servicos")
    suspend fun getServicos(@Header("Authorization") token: String): Response<List<Servico>>
    
    @POST("servicos")
    suspend fun createServico(
        @Header("Authorization") token: String,
        @Body servico: CreateServicoRequest
    ): Response<Servico>
    
    // Funcionários
    @GET("funcionarios")
    suspend fun getFuncionarios(@Header("Authorization") token: String): Response<List<Funcionario>>
    
    // Agendamentos
    @GET("agendamentos")
    suspend fun getAgendamentos(
        @Header("Authorization") token: String,
        @Query("data") data: String?
    ): Response<List<Agendamento>>
    
    @POST("agendamentos")
    suspend fun createAgendamento(
        @Header("Authorization") token: String,
        @Body request: CreateAgendamentoRequest
    ): Response<Agendamento>
    
    @PATCH("agendamentos/{id}")
    suspend fun updateAgendamento(
        @Header("Authorization") token: String,
        @Path("id") id: String,
        @Body request: UpdateAgendamentoRequest
    ): Response<Agendamento>
    
    // Rotas Públicas
    @GET("public/empresa/{linkUnico}")
    suspend fun getEmpresaPublica(@Path("linkUnico") linkUnico: String): Response<EmpresaResponse>
    
    @GET("public/empresa/{linkUnico}/servicos")
    suspend fun getServicosPublicos(@Path("linkUnico") linkUnico: String): Response<List<Servico>>
    
    @GET("public/empresa/{linkUnico}/funcionarios")
    suspend fun getFuncionariosPublicos(@Path("linkUnico") linkUnico: String): Response<List<Funcionario>>
    
    @POST("public/empresa/{linkUnico}/agendamento")
    suspend fun createAgendamentoPublico(
        @Path("linkUnico") linkUnico: String,
        @Body request: CreateAgendamentoRequest
    ): Response<Agendamento>
}
```

## 🔧 Configuração do Retrofit

### RetrofitClient.kt
```kotlin
import okhttp3.OkHttpClient
import okhttp3.logging.HttpLoggingInterceptor
import retrofit2.Retrofit
import retrofit2.converter.gson.GsonConverterFactory
import java.util.concurrent.TimeUnit

object RetrofitClient {
    private const val BASE_URL = "http://10.0.2.2:3000/" // Emulador
    // private const val BASE_URL = "http://192.168.1.X:3000/" // Dispositivo físico
    
    private val loggingInterceptor = HttpLoggingInterceptor().apply {
        level = HttpLoggingInterceptor.Level.BODY
    }
    
    private val okHttpClient = OkHttpClient.Builder()
        .addInterceptor(loggingInterceptor)
        .connectTimeout(30, TimeUnit.SECONDS)
        .readTimeout(30, TimeUnit.SECONDS)
        .writeTimeout(30, TimeUnit.SECONDS)
        .build()
    
    private val retrofit = Retrofit.Builder()
        .baseUrl(BASE_URL)
        .client(okHttpClient)
        .addConverterFactory(GsonConverterFactory.create())
        .build()
    
    val apiService: ApiService = retrofit.create(ApiService::class.java)
}
```

## 💾 Gerenciamento de Token (SharedPreferences)

### TokenManager.kt
```kotlin
import android.content.Context
import android.content.SharedPreferences

class TokenManager(context: Context) {
    private val prefs: SharedPreferences = 
        context.getSharedPreferences("app_prefs", Context.MODE_PRIVATE)
    
    fun saveToken(token: String) {
        prefs.edit().putString("access_token", token).apply()
    }
    
    fun getToken(): String? {
        return prefs.getString("access_token", null)
    }
    
    fun clearToken() {
        prefs.edit().remove("access_token").apply()
    }
}
```

## 📱 Exemplo de Uso (ViewModel)

### AuthViewModel.kt
```kotlin
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import kotlinx.coroutines.launch

class AuthViewModel(
    private val apiService: ApiService,
    private val tokenManager: TokenManager
) : ViewModel() {
    
    fun login(email: String, senha: String, onSuccess: () -> Unit, onError: (String) -> Unit) {
        viewModelScope.launch {
            try {
                val response = apiService.login(LoginRequest(email, senha))
                if (response.isSuccessful) {
                    response.body()?.let {
                        tokenManager.saveToken("Bearer ${it.access_token}")
                        onSuccess()
                    }
                } else {
                    onError("Credenciais inválidas")
                }
            } catch (e: Exception) {
                onError("Erro de conexão: ${e.message}")
            }
        }
    }
}
```

### AgendamentoViewModel.kt
```kotlin
class AgendamentoViewModel(
    private val apiService: ApiService,
    private val tokenManager: TokenManager
) : ViewModel() {
    
    fun criarAgendamento(
        linkUnico: String,
        request: CreateAgendamentoRequest,
        onSuccess: (Agendamento) -> Unit,
        onError: (String) -> Unit
    ) {
        viewModelScope.launch {
            try {
                val response = apiService.createAgendamentoPublico(linkUnico, request)
                if (response.isSuccessful) {
                    response.body()?.let { onSuccess(it) }
                } else {
                    onError("Erro ao criar agendamento")
                }
            } catch (e: Exception) {
                onError("Erro de conexão: ${e.message}")
            }
        }
    }
    
    fun listarAgendamentosDoDia(
        data: String,
        onSuccess: (List<Agendamento>) -> Unit,
        onError: (String) -> Unit
    ) {
        viewModelScope.launch {
            try {
                val token = tokenManager.getToken() ?: run {
                    onError("Não autenticado")
                    return@launch
                }
                
                val response = apiService.getAgendamentos(token, data)
                if (response.isSuccessful) {
                    response.body()?.let { onSuccess(it) }
                } else {
                    onError("Erro ao buscar agendamentos")
                }
            } catch (e: Exception) {
                onError("Erro de conexão: ${e.message}")
            }
        }
    }
}
```

## 🔒 Interceptor para Token Automático

### AuthInterceptor.kt
```kotlin
import okhttp3.Interceptor
import okhttp3.Response

class AuthInterceptor(private val tokenManager: TokenManager) : Interceptor {
    override fun intercept(chain: Interceptor.Chain): Response {
        val token = tokenManager.getToken()
        
        val request = if (token != null) {
            chain.request().newBuilder()
                .addHeader("Authorization", token)
                .build()
        } else {
            chain.request()
        }
        
        return chain.proceed(request)
    }
}
```

## 📝 Exemplo de Activity/Fragment

```kotlin
class LoginActivity : AppCompatActivity() {
    private lateinit var viewModel: AuthViewModel
    
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_login)
        
        val tokenManager = TokenManager(this)
        viewModel = AuthViewModel(RetrofitClient.apiService, tokenManager)
        
        btnLogin.setOnClickListener {
            val email = etEmail.text.toString()
            val senha = etSenha.text.toString()
            
            viewModel.login(
                email = email,
                senha = senha,
                onSuccess = {
                    startActivity(Intent(this, MainActivity::class.java))
                    finish()
                },
                onError = { error ->
                    Toast.makeText(this, error, Toast.LENGTH_SHORT).show()
                }
            )
        }
    }
}
```

## 🌐 Permissões (AndroidManifest.xml)

```xml
<uses-permission android:name="android.permission.INTERNET" />
<uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
```

## 🔧 Configuração de Rede (AndroidManifest.xml)

```xml
<application
    android:usesCleartextTraffic="true"
    ...>
    <!-- Permite HTTP em desenvolvimento -->
</application>
```

## 📌 Dicas Importantes

1. **IP do Servidor:**
   - Emulador: `10.0.2.2`
   - Dispositivo físico: IP local da máquina (ex: `192.168.1.100`)

2. **Formato de Data:**
   - Use ISO 8601: `2024-01-20T14:00:00Z`
   - Biblioteca recomendada: `java.time` ou `joda-time`

3. **Tratamento de Erros:**
   - Sempre verifique `response.isSuccessful`
   - Trate exceções de rede com try-catch

4. **Token JWT:**
   - Salve com prefixo "Bearer "
   - Renove quando expirar (401 Unauthorized)

5. **Coroutines:**
   - Use `viewModelScope` para cancelar automaticamente
   - Use `Dispatchers.IO` para operações de rede

## 🚀 Próximos Passos

1. Implementar refresh token
2. Adicionar cache com Room Database
3. Implementar retry automático
4. Adicionar loading states
5. Implementar offline-first com sincronização

